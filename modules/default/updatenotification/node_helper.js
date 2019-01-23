var SimpleGit = require("simple-git");
var simpleGits = [];
var fs = require("fs");
var path = require("path");
var defaultModules = require(__dirname + "/../defaultmodules.js");
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	config: {},

	updateTimer: null,

	start: () => {
	},

	configureModules: modules => {
		for (moduleName in modules) {
			if (defaultModules.indexOf(moduleName) < 0) {
				// Default modules are included in the main MagicMirror repo
				var moduleFolder =  path.normalize(__dirname + "/../../" + moduleName);

				var stat;
				try {
					stat = fs.statSync(path.join(moduleFolder, ".git"));
				} catch(err) {
					// Error when directory .git doesn't exist
					// This module is not managed with git, skip
					continue;
				}

				var res = (mn, mf) => {
					var git = SimpleGit(mf);
					git.getRemotes(true, (err, remotes) => {
						if (remotes.length < 1 || remotes[0].name.length < 1) {
							// No valid remote for folder, skip
							return;
						}

						// Folder has .git and has at least one git remote, watch this folder
						simpleGits.push({"module": mn, "git": git});
					});
				}(moduleName, moduleFolder);
			}
		}

		// Push MagicMirror itself last, biggest chance it'll show up last in UI and isn't overwritten
		simpleGits.push({"module": "default", "git": SimpleGit(path.normalize(__dirname + "/../../../"))});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "CONFIG") {
			this.config = payload;
		} else if(notification === "MODULES") {
			this.configureModules(payload);
			this.preformFetch();
		}
	},

	preformFetch() {
		var self = this;

		simpleGits.forEach(sg => {
			sg.git.fetch().status((err, data) => {
				data.module = sg.module;
				if (!err) {
					sg.git.log({"-1": null}, (err, data2) => {
						data.hash = data2.latest.hash;
						self.sendSocketNotification("STATUS", data);
					});
				}
			});
		});

		this.scheduleNextFetch(this.config.updateInterval);
	},

	scheduleNextFetch: function(delay) {
		if (delay < 60 * 1000) {
			delay = 60 * 1000
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(() => {
			self.preformFetch();
		}, delay);
	}

});
