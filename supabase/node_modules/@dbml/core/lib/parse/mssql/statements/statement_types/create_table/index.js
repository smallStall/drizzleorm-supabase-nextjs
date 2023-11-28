"use strict";

var P = require('parsimmon');
var KP = require('../../../keyword_parsers');
var _require = require('../../../base_parsers'),
  pIdentifier = _require.pIdentifier,
  pDotDelimitedName = _require.pDotDelimitedName;
var _require2 = require('../../../utils'),
  makeNode = _require2.makeNode,
  makeList = _require2.makeList;
var _require3 = require('../../../constraint_definition'),
  pTableConstraint = _require3.pTableConstraint;
var _require4 = require('../../../index_definition'),
  pTableIndex = _require4.pTableIndex,
  pIgnoredIndexOption = _require4.pIgnoredIndexOption;
var _require5 = require('../../../column_definition'),
  pColumnsDefinition = _require5.pColumnsDefinition;
var A = require('./actions');
var Lang = P.createLanguage({
  CreateTable: function CreateTable(r) {
    return P.seqMap(r.CreateTableKeywords, pDotDelimitedName, r.AsFileTableKeywords.fallback(null), makeList(r.Line), A.makeTable).thru(makeNode()).skip(r.IgnoredTableOptions);
  },
  CreateTableKeywords: function CreateTableKeywords() {
    return P.seq(KP.KeywordCreate, KP.KeywordTable);
  },
  AsFileTableKeywords: function AsFileTableKeywords() {
    return P.seq(KP.KeywordAs, KP.KeywordFileTable);
  },
  Line: function Line(r) {
    return P.alt(r.SystemTimeTableOption, pTableConstraint, pTableIndex, pColumnsDefinition);
  },
  SystemTimeTableOption: function SystemTimeTableOption() {
    return P.seq(KP.KeywordPeriodForST, makeList(pIdentifier)).result(null);
  },
  IgnoredTableOptions: function IgnoredTableOptions(r) {
    return P.alt(pIgnoredIndexOption, r.TextImageTableOption).many();
  },
  TextImageTableOption: function TextImageTableOption() {
    return P.seq(KP.KeywordTextImage_On, pIdentifier);
  }
});
module.exports = Lang.CreateTable;