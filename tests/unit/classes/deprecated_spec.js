const chai = require("chai");
const expect = chai.expect;
const deprecated = require("../../../js/deprecated");

describe("Deprecated", () => {
	it("should be an object", () => {
		expect(deprecated).to.be.an("object");
	});

	it("should contain configs array with deprecated options as strings", () => {
		expect(deprecated.configs).to.be.an("array");
		for (let option of deprecated.configs) {
			expect(option).to.be.an("string");
		}
		expect(deprecated.configs).to.include("kioskmode");
	});
});
