"use strict";

var P = require('parsimmon');
var KP = require('../keyword_parsers');
var _require = require('../base_parsers'),
  pIdentifier = _require.pIdentifier,
  pKeywordClusteredOrNon = _require.pKeywordClusteredOrNon,
  pFunction = _require.pFunction,
  pOptionList = _require.pOptionList,
  pColumnNames = _require.pColumnNames,
  pKeywordPKOrUnique = _require.pKeywordPKOrUnique,
  pOption = _require.pOption;
var _require2 = require('../utils'),
  makeNode = _require2.makeNode;
var A = require('./actions');
var Lang = P.createLanguage({
  TableIndex: function TableIndex(r) {
    return P.seqMap(KP.KeywordIndex, pIdentifier, KP.KeywordUnique.fallback(null), pKeywordClusteredOrNon.fallback(null), KP.KeywordColumnStore.fallback(null), pColumnNames, A.makeTableIndex).thru(makeNode()).skip(r.IgnoredIndexOptions);
  },
  TableConstraintIndex: function TableConstraintIndex(r) {
    return P.seqMap(pKeywordPKOrUnique, pKeywordClusteredOrNon.fallback(null), pColumnNames, A.makeTableConstraintIndex).thru(makeNode()).skip(r.IgnoredIndexOptions);
  },
  ColumnConstraintIndex: function ColumnConstraintIndex(r) {
    return P.seq(pKeywordPKOrUnique).skip(r.IgnoredIndexOptions).map(function (value) {
      return value[0];
    });
  },
  ColumnIndex: function ColumnIndex(r) {
    return P.seqMap(KP.KeywordIndex, pIdentifier, A.makeColumnIndex).thru(makeNode()).skip(r.IgnoredIndexOptions);
  },
  IgnoredIndexOptions: function IgnoredIndexOptions(r) {
    return P.alt(pKeywordClusteredOrNon, r.IgnoredIndexOption).many();
  },
  IgnoredIndexOption: function IgnoredIndexOption(r) {
    return P.alt(r.WithIndexOption, r.ColumnIndexFilestream, r.OnIndexOption, r.WithFillFactorOption);
  },
  WithIndexOption: function WithIndexOption() {
    return P.seq(KP.KeywordWith, pOptionList);
  },
  WithFillFactorOption: function WithFillFactorOption() {
    return P.seq(KP.KeywordWith, pOption);
  },
  OnIndexOption: function OnIndexOption() {
    return P.seq(KP.KeywordOn, P.alt(pIdentifier, pFunction));
  },
  ColumnIndexFilestream: function ColumnIndexFilestream() {
    return P.seq(KP.KeywordFilestream_On, pIdentifier);
  }
});
module.exports = {
  pColumnIndex: Lang.ColumnIndex,
  pIgnoredIndexOption: Lang.IgnoredIndexOption,
  pTableIndex: Lang.TableIndex,
  pColumnConstraintIndex: Lang.ColumnConstraintIndex,
  pTableConstraintIndex: Lang.TableConstraintIndex
};