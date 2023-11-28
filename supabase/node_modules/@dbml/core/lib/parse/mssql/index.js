"use strict";

var mssqlParser = require('./statements');
mssqlParser.parseWithPegError = function (input) {
  try {
    return mssqlParser.tryParse(input);
  } catch (err) {
    var pegJSError = {
      name: 'SyntaxError'
    };
    console.error(err);
    pegJSError.location = {};
    pegJSError.location.start = err.result.index;
    pegJSError.found = input[pegJSError.location.start.offset];
    var lastExpected = err.result.expected.pop();
    var expectedString = "".concat(err.result.expected.join(', '), ", or ").concat(lastExpected);
    pegJSError.message = "Expected ".concat(expectedString, " but \"").concat(pegJSError.found, "\" found.");
    // eslint-disable-next-line no-console
    throw pegJSError;
  }
};
module.exports = mssqlParser;