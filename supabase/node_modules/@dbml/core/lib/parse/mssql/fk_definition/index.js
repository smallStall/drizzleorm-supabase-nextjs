"use strict";

var P = require('parsimmon');
var KP = require('../keyword_parsers');
var _require = require('../base_parsers'),
  pDotDelimitedName = _require.pDotDelimitedName,
  pIdentifier = _require.pIdentifier,
  pColumnNames = _require.pColumnNames;
var _require2 = require('../utils'),
  makeList = _require2.makeList,
  makeNode = _require2.makeNode;
var A = require('./actions');
var Lang = P.createLanguage({
  TableConstraintFK: function TableConstraintFK(r) {
    return P.seqMap(KP.KeywordForeignKey.fallback(null), r.TableEndpoint, KP.KeywordReferences, pDotDelimitedName, r.TableEndpoint.fallback(null), r.FKOptions.fallback(null), A.makeTableConstraintFK);
  },
  TableEndpoint: function TableEndpoint() {
    return P.seqMap(pColumnNames, A.makeTableEndpoint).thru(makeNode());
  },
  ColumnConstraintFK: function ColumnConstraintFK(r) {
    return P.seqMap(r.FKKeywords, pDotDelimitedName, makeList(pIdentifier).fallback(null), r.FKOptions.fallback(null), A.makeColumnConstraintFK);
  },
  FKOptions: function FKOptions(r) {
    return P.alt(r.FKOnDelete, r.FKOnUpdate, r.FKNFR).many();
  },
  FKKeywords: function FKKeywords() {
    return P.seq(KP.KeywordForeignKey.fallback(null), KP.KeywordReferences);
  },
  FKOnDelete: function FKOnDelete(r) {
    return P.seqMap(KP.KeywordOnDelete, r.FKOnOptions, A.makeOnSetting);
  },
  FKOnUpdate: function FKOnUpdate(r) {
    return P.seqMap(KP.KeywordOnUpdate, r.FKOnOptions, A.makeOnSetting);
  },
  FKNFR: function FKNFR() {
    return KP.KeywordNFR.map(function (value) {
      return {
        type: value
      };
    });
  },
  FKOnOptions: function FKOnOptions() {
    return P.alt(KP.KeywordNoAction, KP.KeywordCascade, KP.KeywordSetDefault, KP.KeywordSetNull);
  }
});
module.exports = {
  pColumnConstraintFK: Lang.ColumnConstraintFK,
  pTableConstraintFK: Lang.TableConstraintFK
};