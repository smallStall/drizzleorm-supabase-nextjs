"use strict";

var P = require('parsimmon');
var KP = require('../../../keyword_parsers');
var _require = require('../../../base_parsers'),
  pDotDelimitedName = _require.pDotDelimitedName,
  pIgnore = _require.pIgnore;
var A = require('./actions');
var pAddAction = require('./add');
var Lang = P.createLanguage({
  AlterTable: function AlterTable(r) {
    return P.seqMap(r.AlterTableKeywords, pDotDelimitedName, r.AlterTableActions, A.handleAlterTableResult);
  },
  AlterTableActions: function AlterTableActions(r) {
    return P.alt(pAddAction, r.IgnoredAlterTableActions);
  },
  AlterTableKeywords: function AlterTableKeywords() {
    return P.seq(KP.KeywordAlter, KP.KeywordTable);
  },
  IgnoredAlterTableActions: function IgnoredAlterTableActions(r) {
    return P.seq(r.IgnoredAlterTableActionKeywords, pIgnore).result(null);
  },
  IgnoredAlterTableActionKeywords: function IgnoredAlterTableActionKeywords() {
    return P.alt(KP.KeywordWith, KP.KeywordAlterColumn, KP.KeywordDrop, KP.KeywordEnable, KP.KeywordDisable, KP.KeywordCheck, KP.KeywordSwitch, KP.KeywordSet, KP.KeywordRebuild);
  }
});
module.exports = Lang.AlterTable;