"use strict";

var P = require('parsimmon');
var KP = require('../../../../keyword_parsers');
var _require = require('../../../../base_parsers'),
  pIdentifier = _require.pIdentifier;
var _require2 = require('../../../../utils'),
  makeNode = _require2.makeNode,
  makeList = _require2.makeList;
var A = require('./actions');
var _require3 = require('../../../../fk_definition'),
  pTableConstraintFK = _require3.pTableConstraintFK;
var _require4 = require('../../../../index_definition'),
  pTableConstraintIndex = _require4.pTableConstraintIndex;
var _require5 = require('../../../../constraint_definition'),
  pConstraintCheck = _require5.pConstraintCheck,
  pConstExpr = _require5.pConstExpr,
  pConstraintName = _require5.pConstraintName;
var _require6 = require('../../../../column_definition'),
  pColumnsDefinition = _require6.pColumnsDefinition;
var Lang = P.createLanguage({
  AddAction: function AddAction(r) {
    return P.seq(KP.KeywordAdd, r.AddOption.sepBy1(KP.Comma)).map(function (value) {
      return value[1];
    });
  },
  AddOption: function AddOption(r) {
    return P.alt(r.AddConstraint, pColumnsDefinition.result(null), r.IgnoredAddSystemTimeOption.result(null));
  },
  IgnoredAddSystemTimeOption: function IgnoredAddSystemTimeOption() {
    return P.alt(pIdentifier, P.regexp(/[(),]/)).many();
  },
  AddConstraint: function AddConstraint(r) {
    return P.seqMap(pConstraintName.fallback(null), r.AddConstraintOption, A.makeTableConstraint).thru(makeNode());
  },
  AddConstraintOption: function AddConstraintOption(r) {
    return P.alt(pTableConstraintFK, pTableConstraintIndex, pConstraintCheck, r.AddConstraintDefault, r.IgnoredAddConstraintOption.result(null));
  },
  IgnoredAddConstraintOption: function IgnoredAddConstraintOption(r) {
    return P.alt(r.AddConstraintConnection);
  },
  AddConstraintDefault: function AddConstraintDefault() {
    return P.seqMap(KP.KeywordDefault, pConstExpr, KP.KeywordFor, pIdentifier, KP.KeywordWithValues.fallback(null), A.makeDefault);
  },
  AddConstraintConnection: function AddConstraintConnection() {
    return P.seq(KP.KeywordConnection, makeList(P.seq(pIdentifier, KP.KeywordTo, pIdentifier)));
  }
});
module.exports = Lang.AddAction;