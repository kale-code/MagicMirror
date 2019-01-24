const helpers = require("./global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("ipWhitelist directive configuration", function () {
	helpers.setupTimeout(this);

	var app = null;

	beforeEach(() => helpers.startApplication({
		args: ["js/electron.js"]
	}).then(startedApp => { app = startedApp; }));

	afterEach(() => helpers.stopApplication(app));

	describe("Set ipWhitelist without access", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/noIpWhiteList.js";
		});
		it("should return 403", done => {
			request.get("http://localhost:8080", (err, res, body) => {
				expect(res.statusCode).to.equal(403);
				done();
			});
		});
	});

	describe("Set ipWhitelist []", () => {
		before(() => {
			// Set config sample for use in test
			process.env.MM_CONFIG_FILE = "tests/configs/empty_ipWhiteList.js";
		});
		it("should return 200", done => {
			request.get("http://localhost:8080", (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});
	});

});
