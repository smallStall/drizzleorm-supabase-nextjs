"use strict";

var P = require('parsimmon');
var KP = require('../../../keyword_parsers');
var _require = require('../../../base_parsers'),
  pIdentifier = _require.pIdentifier,
  pKeywordClusteredOrNon = _require.pKeywordClusteredOrNon,
  pConst = _require.pConst,
  pColumnNames = _require.pColumnNames,
  pDotDelimitedName = _require.pDotDelimitedName,
  pComparsionOp = _require.pComparsionOp;
var _require2 = require('../../../utils'),
  makeNode = _require2.makeNode,
  makeList = _require2.makeList;
var A = require('./actions');
var _require3 = require('../../../index_definition'),
  pIgnoredIndexOption = _require3.pIgnoredIndexOption;
var Lang = P.createLanguage({
  CreateIndex: function CreateIndex(r) {
    return P.seqMap(KP.KeywordCreate, KP.KeywordUnique.fallback(null), pKeywordClusteredOrNon.fallback(null), KP.KeywordIndex, pIdentifier, KP.KeywordOn, pDotDelimitedName, pColumnNames, A.makeIndex).thru(makeNode()).skip(r.IgnoredCreateIndexOptions);
  },
  IgnoredCreateIndexOptions: function IgnoredCreateIndexOptions(r) {
    return P.alt(pIgnoredIndexOption, r.IncludeIndexOption, r.WhereIndexOption).many();
  },
  IncludeIndexOption: function IncludeIndexOption() {
    return P.seq(KP.KeywordInclude, pColumnNames);
  },
  WhereIndexOption: function WhereIndexOption(r) {
    return P.seq(KP.KeywordWhere, r.FilterPredicate);
  },
  FilterPredicate: function FilterPredicate(r) {
    return P.seq(r.Conjunct, P.seq(KP.LogicalOpAnd, r.Conjunct).fallback(null));
  },
  Conjunct: function Conjunct(r) {
    return P.alt(r.Disjunct, r.Comparsion);
  },
  Disjunct: function Disjunct() {
    return P.seq(pIdentifier, KP.KeywordIn, makeList(pConst));
  },
  Comparsion: function Comparsion() {
    return P.seq(pIdentifier, pComparsionOp, pConst);
  }
});
module.exports = Lang.CreateIndex;