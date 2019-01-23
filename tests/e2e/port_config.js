const helpers = require("./global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

describe("port directive configuration", function () {
	helpers.setupTimeout(this);

	var app = null;

	beforeEach(() => helpers.startApplication({
			args: ["js/electron.js"]
		}).then(startedApp => { app = startedApp; }));

	afterEach(() => helpers.stopApplication(app));

	describe("Set port 8090", () => {
		before(() => {
			// Set config sample for use in this test
			process.env.MM_CONFIG_FILE = "tests/configs/port_8090.js";
		});

		it("should return 200", done => {
			request.get("http://localhost:8090", (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});
	});

	describe("Set port 8100 on enviroment variable MM_PORT", () => {
		before(() => {
			process.env.MM_PORT = 8100;
			// Set config sample for use in this test
			process.env.MM_CONFIG_FILE = "tests/configs/port_8090.js";
		});

		after(() => {
			delete process.env.MM_PORT;
		});

		it("should return 200", done => {
			request.get("http://localhost:8100", (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});
	});

});
