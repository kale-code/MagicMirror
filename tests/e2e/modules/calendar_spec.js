const helpers = require("../global-setup");
const path = require("path");
const request = require("request");
const serverBasicAuth = require("../../servers/basic-auth.js");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("Calendar module", function() {
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
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/calendar/default.js";
		});

		it("Should return TestEvents", () => app.client.waitUntilTextExists(".calendar", "TestEvent", 10000));
	});

	describe("Basic auth", () => {
		before(() => {
			serverBasicAuth.listen(8010);
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/calendar/basic-auth.js";
		});

		after(done => {
			serverBasicAuth.close(done());
		});

		it("Should return TestEvents", () => app.client.waitUntilTextExists(".calendar", "TestEvent", 10000));
	});

	describe("Basic auth by default", () => {
		before(() => {
			serverBasicAuth.listen(8011);
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/calendar/auth-default.js";
		});

		after(done => {
			serverBasicAuth.close(done());
		});

		it("Should return TestEvents", () => app.client.waitUntilTextExists(".calendar", "TestEvent", 10000));
	});

	describe("Basic auth backward compatibilty configuration: DEPRECATED", () => {
		before(() => {
			serverBasicAuth.listen(8012);
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/calendar/old-basic-auth.js";
		});

		after(done => {
			serverBasicAuth.close(done());
		});

		it("Should return TestEvents", () => app.client.waitUntilTextExists(".calendar", "TestEvent", 10000));
	});

	describe("Fail Basic auth", () => {
		before(() => {
			serverBasicAuth.listen(8020);
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/calendar/fail-basic-auth.js";
		});

		after(done => {
			serverBasicAuth.close(done());
		});

		it("Should return No upcoming events", () => app.client.waitUntilTextExists(".calendar", "No upcoming events.", 10000));
	});
});
