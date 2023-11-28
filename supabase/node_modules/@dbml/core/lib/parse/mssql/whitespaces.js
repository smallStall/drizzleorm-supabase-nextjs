"use strict";

var P = require('parsimmon');
var Lang = P.createLanguage({
  WhiteSpaces: function WhiteSpaces(r) {
    return P.alt(r.WhiteSpace, r.InlineComment, r.MulLineComment).many().desc('whitespaces or comments');
  },
  WhiteSpace: function WhiteSpace() {
    return P.regexp(/\s/).desc('whitespaces');
  },
  InlineComment: function InlineComment() {
    return P.seq(P.string('--'), P.regexp(/[^\n\r]*/)).desc('comments');
  },
  MulLineComment: function MulLineComment() {
    return P.regexp(/\/\*[\s\S]+?\*\//).desc('comments');
  }
});
module.exports = Lang.WhiteSpaces;