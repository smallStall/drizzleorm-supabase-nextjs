"use strict";

var P = require('parsimmon');
var wss = require('./whitespaces');
exports.word = function (string) {
  return P.string(string).skip(wss).desc("\"".concat(string, "\""));
};
function replaceWhitespaceWithRegexp(regexp) {
  var string = String(regexp);
  string = string.replace(/[\s]+/g, '\\s+');
  var lastSlash = string.lastIndexOf('/');
  return new RegExp(string.slice(1, lastSlash), string.slice(lastSlash + 1));
}
exports.keyword = function (regexp) {
  var newRegexp = regexp;
  var desc = regexp.source;
  newRegexp = replaceWhitespaceWithRegexp(regexp);
  return P.regexp(newRegexp).skip(wss).desc("\"".concat(desc, "\""));
};