
/*
const TESTS = require("./tests");
return TESTS.run("ide");
*/

const API = require("./api");
const TESTS_IDE = require("./tests/ide");

exports.run = function (name) {

	if (name === "ide") {
		return TESTS_IDE(API);
	}

	throw new Error("Test with name '" + name + "' not found!");
}
