const helpers = require("../global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("Newsfeed module", function () {
	helpers.setupTimeout(this);

	var app = null;

	beforeEach(() => helpers
		.startApplication({
			args: ["js/electron.js"]
		})
		.then(startedApp => {
			app = startedApp;
		}));

	afterEach(() => helpers.stopApplication(app));

	describe("Default configuration", () => {
		before(() => {
			process.env.MM_CONFIG_FILE = "tests/configs/modules/newsfeed/default.js";
		});

		it("show title newsfeed", () => app.client.waitUntilTextExists(".newsfeed .small", "Rodrigo Ramirez Blog", 10000).should.be.fulfilled);
	});
});
