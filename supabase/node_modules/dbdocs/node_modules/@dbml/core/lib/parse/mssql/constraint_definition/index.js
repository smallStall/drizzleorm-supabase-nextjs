"use strict";

var P = require('parsimmon');
var KP = require('../keyword_parsers');
var pExpression = require('../expression');
var _require = require('../base_parsers'),
  pIdentifier = _require.pIdentifier,
  pConst = _require.pConst,
  pFunction = _require.pFunction;
var _require2 = require('../utils'),
  makeList = _require2.makeList,
  streamline = _require2.streamline,
  makeNode = _require2.makeNode;
var _require3 = require('../fk_definition'),
  pColumnConstraintFK = _require3.pColumnConstraintFK,
  pTableConstraintFK = _require3.pTableConstraintFK;
var _require4 = require('../index_definition'),
  pColumnConstraintIndex = _require4.pColumnConstraintIndex,
  pTableConstraintIndex = _require4.pTableConstraintIndex;
var A = require('./actions');
var Lang = P.createLanguage({
  TableConstraint: function TableConstraint(r) {
    return P.seqMap(r.ConstraintName.fallback(null), r.TableConstraintOption, A.makeTableConstraint).thru(makeNode());
  },
  TableConstraintOption: function TableConstraintOption(r) {
    return P.alt(pTableConstraintFK, pTableConstraintIndex, r.ConstraintCheck);
  },
  ColumnConstraint: function ColumnConstraint(r) {
    return P.seq(r.ConstraintName.fallback(null), r.ColumnConstraintOption).map(function (value) {
      return value[1];
    });
  },
  ColumnConstraintOption: function ColumnConstraintOption(r) {
    return P.alt(pColumnConstraintIndex, pColumnConstraintFK, r.ConstraintCheck, r.ConstraintDefault);
  },
  ConstraintCheck: function ConstraintCheck(r) {
    return P.seq(KP.KeywordCheck, KP.KeywordNFR.fallback(null), r.ConstraintCheckExpr).map(function (value) {
      return value[2];
    });
  },
  ConstraintCheckExpr: function ConstraintCheckExpr(r) {
    return P.alt(P.seq(KP.LParen.fallback(null), r.ConstraintCheckEnum, KP.RParen.fallback(null)).map(function (value) {
      return value[1];
    }), pExpression.thru(streamline('expression')));
  },
  ConstraintCheckEnum: function ConstraintCheckEnum() {
    return P.seqMap(pIdentifier, KP.LogicalOpIn, makeList(pConst.thru(makeNode())), A.makeConstraintCheckEnum).thru(makeNode());
  },
  ConstraintDefault: function ConstraintDefault(r) {
    return P.seqMap(KP.KeywordDefault, r.ConstExpr, A.makeDefaultConstraint);
  },
  ConstExpr: function ConstExpr(r) {
    return P.alt(P.seq(KP.LParen, r.ConstExpr, KP.RParen).map(function (value) {
      return value[1];
    }), pFunction, pConst, KP.KeywordNull.thru(streamline('boolean')));
  },
  ConstraintName: function ConstraintName() {
    return P.seq(KP.KeywordConstraint, pIdentifier).map(function (value) {
      return value[1];
    });
  }
});
module.exports = {
  pColumnConstraint: Lang.ColumnConstraint,
  pTableConstraint: Lang.TableConstraint,
  pConstraintCheck: Lang.ConstraintCheck,
  pConstraintName: Lang.ConstraintName,
  pConstExpr: Lang.ConstExpr,
  makeTableConstraint: A.makeTableConstraint
};