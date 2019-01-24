const helpers = require("../global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("Compliments module", function () {
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

	describe("parts of days", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/modules/compliments/compliments_parts_day.js";
		});

		it("if Morning compliments for that part of day", () => {
			var hour = new Date().getHours();
			if (hour >= 3 && hour < 12) {
				// if morning check
				return app.client.waitUntilWindowLoaded().getText(".compliments").then(text => {
					expect(text).to.be.oneOf(["Hi", "Good Morning", "Morning test"]);
				});
			}
		});

		it("if Afternoon show Compliments for that part of day", () => {
			var hour = new Date().getHours();
			if (hour >= 12 && hour < 17) {
				// if morning check
				return app.client.waitUntilWindowLoaded().getText(".compliments").then(text => {
					expect(text).to.be.oneOf(["Hello", "Good Afternoon", "Afternoon test"]);
				});
			}
		});

		it("if Evening show Compliments for that part of day", () => {
			var hour = new Date().getHours();
			if (!(hour >= 3 && hour < 12) && !(hour >= 12 && hour < 17)) {
				// if evening check
				return app.client.waitUntilWindowLoaded().getText(".compliments").then(text => {
					expect(text).to.be.oneOf(["Hello There", "Good Evening", "Evening test"]);
				});
			}
		});
	});

	describe("Feature anytime in compliments module", () => {
		describe("Set anytime and empty compliments for morning, evening and afternoon ", () => {
			before(() => {
				// Set config sample for use in test
				process.env.MM_CONFIG_FILE = "tests/configs/modules/compliments/compliments_anytime.js";
			});

			it("Show anytime because if configure empty parts of day compliments and set anytime compliments", () => app.client.waitUntilWindowLoaded().getText(".compliments").then(text => {
				expect(text).to.be.oneOf(["Anytime here"]);
			}));
		});

		describe("Only anytime present in configuration compliments", () => {
			before(() => {
				// Set config sample for use in test
				process.env.MM_CONFIG_FILE = "tests/configs/modules/compliments/compliments_only_anytime.js";
			});

			it("Show anytime compliments", () => app.client.waitUntilWindowLoaded().getText(".compliments").then(text => {
				expect(text).to.be.oneOf(["Anytime here"]);
			}));
		});
	});
});
