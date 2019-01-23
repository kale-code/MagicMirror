const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const {JSDOM} = require("jsdom");
const express = require("express");

describe("Translator", () => {
	let server;

	before(() => {
		const app = express();
		app.use(helmet());
		app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			next();
		});
		app.use("/translations", express.static(path.join(__dirname, "..", "..", "..", "tests", "configs", "data")));

		server = app.listen(3000);
	});

	after(() => {
		server.close();
	});

	describe("translate", () => {
		const translations = {
			"MMM-Module": {
				"Hello": "Hallo",
				"Hello {username}": "Hallo {username}"
			}
		};

		const coreTranslations = {
			"Hello": "XXX",
			"Hello {username}": "XXX",
			"FOO": "Foo",
			"BAR {something}": "Bar {something}"
		};

		const translationsFallback = {
			"MMM-Module": {
				"Hello": "XXX",
				"Hello {username}": "XXX",
				"FOO": "XXX",
				"BAR {something}": "XXX",
				"A key": "A translation"
			}
		};

		const coreTranslationsFallback = {
			"FOO": "XXX",
			"BAR {something}": "XXX",
			"Hello": "XXX",
			"Hello {username}": "XXX",
			"A key": "XXX",
			"Fallback": "core fallback"
		};

		function setTranslations(Translator) {
			Translator.translations = translations;
			Translator.coreTranslations = coreTranslations;
			Translator.translationsFallback = translationsFallback;
			Translator.coreTranslationsFallback = coreTranslationsFallback;
		}

		it("should return custom module translation", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				let translation = Translator.translate({name: "MMM-Module"}, "Hello");
				expect(translation).to.be.equal("Hallo");
				translation = Translator.translate({name: "MMM-Module"}, "Hello {username}", {username: "fewieden"});
				expect(translation).to.be.equal("Hallo fewieden");
				done();
			};
		});

		it("should return core translation", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				let translation = Translator.translate({name: "MMM-Module"}, "FOO");
				expect(translation).to.be.equal("Foo");
				translation = Translator.translate({name: "MMM-Module"}, "BAR {something}", {something: "Lorem Ipsum"});
				expect(translation).to.be.equal("Bar Lorem Ipsum");
				done();
			};
		});

		it("should return custom module translation fallback", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				const translation = Translator.translate({name: "MMM-Module"}, "A key");
				expect(translation).to.be.equal("A translation");
				done();
			};
		});

		it("should return core translation fallback", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				const translation = Translator.translate({name: "MMM-Module"}, "Fallback");
				expect(translation).to.be.equal("core fallback");
				done();
			};
		});

		it("should return translation with placeholder for missing variables", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				const translation = Translator.translate({name: "MMM-Module"}, "Hello {username}");
				expect(translation).to.be.equal("Hallo {username}");
				done();
			};
		});

		it("should return key if no translation was found", done => {
			const dom = new JSDOM(`<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				setTranslations(Translator);
				const translation = Translator.translate({name: "MMM-Module"}, "MISSING");
				expect(translation).to.be.equal("MISSING");
				done();
			};
		});
	});

	describe("load", () => {
		const mmm = {
			name: "TranslationTest",
			file:(file) {
				return `http://localhost:3000/translations/${file}`;
			}
		};

		it("should load translations", done => {
			const dom = new JSDOM(`<script>var Log = {log: function(){}};</script><script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				const file = "TranslationTest.json";

				Translator.load(mmm, file, false, () => {
					const json = require(path.join(__dirname, "..", "..", "..", "tests", "configs", "data", file));
					expect(Translator.translations[mmm.name]).to.be.deep.equal(json);
					done();
				});
			};
		});

		it("should load translation fallbacks", done => {
			const dom = new JSDOM(`<script>var Log = {log: function(){}};</script><script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				const file = "TranslationTest.json";

				Translator.load(mmm, file, true, () => {
					const json = require(path.join(__dirname, "..", "..", "..", "tests", "configs", "data", file));
					expect(Translator.translationsFallback[mmm.name]).to.be.deep.equal(json);
					done();
				});
			};
		});

		it("should strip comments", done => {
			const dom = new JSDOM(`<script>var Log = {log: function(){}};</script><script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				const file = "StripComments.json";

				Translator.load(mmm, file, false, () => {
					expect(Translator.translations[mmm.name]).to.be.deep.equal({
						"FOO\"BAR": "Today",
						"N": "N",
						"E": "E",
						"S": "S",
						"W": "W"
					});
					done();
				});
			};
		});

		it("should not load translations, if module fallback exists", done => {
			const dom = new JSDOM(`<script>var Log = {log: function(){}};</script><script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator, XMLHttpRequest} = dom.window;
				const file = "TranslationTest.json";

				XMLHttpRequest.prototype.send = () => {
					throw "Shouldn't load files";
				};

				Translator.translationsFallback[mmm.name] = {
					Hello: "Hallo"
				};

				Translator.load(mmm, file, false, () => {
					expect(Translator.translations[mmm.name]).to.be.undefined;
					expect(Translator.translationsFallback[mmm.name]).to.be.deep.equal({
						Hello: "Hallo"
					});
					done();
				});
			};
		});
	});

	describe("loadCoreTranslations", () => {
		it("should load core translations and fallback", done => {
			const dom = new JSDOM(`<script>var translations = {en: "http://localhost:3000/translations/en.json"}; var Log = {log: function(){}};</script>\
					<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				Translator.loadCoreTranslations("en");

				const en = require(path.join(__dirname, "..", "..", "..", "tests", "configs", "data", "en.json"));
				setTimeout(() => {
					expect(Translator.coreTranslations).to.be.deep.equal(en);
					expect(Translator.coreTranslationsFallback).to.be.deep.equal(en);
					done();
				}, 500);
			};
		});

		it("should load core fallback if language cannot be found", done => {
			const dom = new JSDOM(`<script>var translations = {en: "http://localhost:3000/translations/en.json"}; var Log = {log: function(){}};</script>\
					<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				Translator.loadCoreTranslations("MISSINGLANG");

				const en = require(path.join(__dirname, "..", "..", "..", "tests", "configs", "data", "en.json"));
				setTimeout(() => {
					expect(Translator.coreTranslations).to.be.deep.equal({});
					expect(Translator.coreTranslationsFallback).to.be.deep.equal(en);
					done();
				}, 500);
			};
		});
	});

	describe("loadCoreTranslationsFallback", () => {
		it("should load core translations fallback", done => {
			const dom = new JSDOM(`<script>var translations = {en: "http://localhost:3000/translations/en.json"}; var Log = {log: function(){}};</script>\
					<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				Translator.loadCoreTranslationsFallback();

				const en = require(path.join(__dirname, "..", "..", "..", "tests", "configs", "data", "en.json"));
				setTimeout(() => {
					expect(Translator.coreTranslationsFallback).to.be.deep.equal(en);
					done();
				}, 500);
			};
		});

		it("should load core fallback if language cannot be found", done => {
			const dom = new JSDOM(`<script>var translations = {}; var Log = {log: function(){}};</script>\
					<script src="${path.join(__dirname, "..", "..", "..", "js", "translator.js")}">`, { runScripts: "dangerously",
				resources: "usable" });
			dom.window.onload = () => {
				const {Translator} = dom.window;
				Translator.loadCoreTranslations();

				setTimeout(() => {
					expect(Translator.coreTranslationsFallback).to.be.deep.equal({});
					done();
				}, 500);
			};
		});
	});
});
