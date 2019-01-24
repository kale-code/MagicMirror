const helpers = require("./global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("Position of modules", function () {
	helpers.setupTimeout(this);

	var app = null;

	describe("Using helloworld", () => {

		after(() => helpers.stopApplication(app));

		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/positions.js";
			return helpers.startApplication({
				args: ["js/electron.js"]
			}).then(startedApp => { app = startedApp; })

		});

		var positions = ["top_bar", "top_left", "top_center", "top_right", "upper_third",
			"middle_center", "lower_third", "bottom_left", "bottom_center", "bottom_right",
			"bottom_bar", "fullscreen_above", "fullscreen_below"];

		var position;
		var className;
		for (idx in positions) {
			position = positions[idx];
			className = position.replace("_", ".");
			it("show text in " + position, () => app.client.waitUntilWindowLoaded()
				.getText("." + className).should.eventually.equal("Text in " + position));
		}
	});

});
