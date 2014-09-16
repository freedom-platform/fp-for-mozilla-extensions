var main = require("./main");

exports["test via command-line"] = function(assert, done) {
  assert.pass("TODO: Implement command-line testing");
  done();
};

require("sdk/test").run(exports);
