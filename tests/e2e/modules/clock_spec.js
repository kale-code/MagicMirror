const helpers = require("../global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("Clock module", function() {
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

	describe("with default 24hr clock config", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/clock/clock_24hr.js";
		});

		it("shows date with correct format", () => {
			const dateRegex = /^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .date").should.eventually.match(dateRegex);
		});

		it("shows time in 24hr format", () => {
			const timeRegex = /^(?:2[0-3]|[01]\d):[0-5]\d[0-5]\d$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .time").should.eventually.match(timeRegex);
		});
	});

	describe("with default 12hr clock config", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/clock/clock_12hr.js";
		});

		it("shows date with correct format", () => {
			const dateRegex = /^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .date").should.eventually.match(dateRegex);
		});

		it("shows time in 12hr format", () => {
			const timeRegex = /^(?:1[0-2]|[1-9]):[0-5]\d[0-5]\d[ap]m$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .time").should.eventually.match(timeRegex);
		});
	});

	describe("with showPeriodUpper config enabled", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/clock/clock_showPeriodUpper.js";
		});

		it("shows 12hr time with upper case AM/PM", () => {
			const timeRegex = /^(?:1[0-2]|[1-9]):[0-5]\d[0-5]\d[AP]M$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .time").should.eventually.match(timeRegex);
		});
	});

	describe("with displaySeconds config disabled", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/clock/clock_displaySeconds_false.js";
		});

		it("shows 12hr time without seconds am/pm", () => {
			const timeRegex = /^(?:1[0-2]|[1-9]):[0-5]\d[ap]m$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .time").should.eventually.match(timeRegex);
		});
	});

	describe("with showWeek config enabled", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/clock/clock_showWeek.js";
		});

		it("shows week with correct format", () => {
			const weekRegex = /^Week [0-9]{1,2}$/;
			return app.client.waitUntilWindowLoaded().getText(".clock .week").should.eventually.match(weekRegex);
		});

		it("shows week with correct number of week of year", () => {
			it("FIXME: if the day is a sunday this not match");
			//	const currentWeekNumber = require("current-week-number")();
			});
	});
});
