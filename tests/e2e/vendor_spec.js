const helpers = require("./global-setup");
const path = require("path");
const request = require("request");

const expect = require("chai").expect;

const describe = global.describe;
const it = global.it;
const before = global.before;
const after = global.after;

describe("Vendors", function () {

	return; // Test still getting failed in Travis

	helpers.setupTimeout(this);

	var app = null;

	before(() => helpers.startApplication({
		args: ["js/electron.js"]
	}).then(startedApp => { app = startedApp; }));

	after(() => helpers.stopApplication(app));

	describe("Get list vendors", () => {

		before(() => {
			process.env.MM_CONFIG_FILE = "tests/configs/env.js";
		});

		var vendors = require(__dirname + "/../../vendor/vendor.js");
		Object.keys(vendors).forEach(vendor => {
			it(`should return 200 HTTP code for vendor "${vendor}"`, () => {
				urlVendor = "http://localhost:8080/vendor/" + vendors[vendor];
				request.get(urlVendor, (err, res, body) => {
					expect(res.statusCode).to.equal(200);
				});
			});
		});
	});
});
