var fs = require("fs");
var path = require("path");
var chai = require("chai");
var expect = chai.expect;
var vm = require("vm");


describe("Functions module currentweather", () => {


	// Fake for use by currentweather.js
	Module = {};
	config = {};
	Module.definitions = {};
	Module.register = (name, moduleDefinition) => {
		Module.definitions[name] = moduleDefinition;
	};


	before(() => {
		require("../../../modules/default/currentweather/currentweather.js");
		Module.definitions.currentweather.config = {};
	});

	describe("roundValue", () => {

		describe("this.config.roundTemp is true", () => {
			before(() => {
				Module.definitions.currentweather.config.roundTemp = true;
			});

			var values = [
				// index 0 value
				// index 1 expect
				[1      ,  "1"],
				[1    ,  "1"],
				[1.02   ,  "1"],
				[10.12  , "10"],
				[2    ,  "2"],
				["2.12" ,  "2"],
				[10.1   , "10"]
			]

			values.forEach(value => {
				it(`for ${value[0]} should be return ${value[1]}`, () => {
					expect(Module.definitions.currentweather.roundValue(value[0])).to.equal(value[1]);
				});
			});
		});


		describe("this.config.roundTemp is false", () => {

			before(() => {
				Module.definitions.currentweather.config.roundTemp = false;
			});

			var values = [
				// index 0 value
				// index 1 expect
				[1      ,  "1.0"],
				[1    ,  "1.0"],
				[1.02   ,  "1.0"],
				[10.12  , "10.1"],
				[2    ,  "2.0"],
				["2.12" ,  "2.1"],
				[10.1   , "10.1"],
				[10.1  , "10.1"]
			]

			values.forEach(value => {
				it(`for ${value[0]} should be return ${value[1]}`, () => {
					expect(Module.definitions.currentweather.roundValue(value[0])).to.equal(value[1]);
				});
			});
		});
	});
});
