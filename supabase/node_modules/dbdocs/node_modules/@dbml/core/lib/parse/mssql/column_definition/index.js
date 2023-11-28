"use strict";

var P = require('parsimmon');
var KP = require('../keyword_parsers');
var _require = require('../base_parsers'),
  pDotDelimitedName = _require.pDotDelimitedName,
  pIdentifier = _require.pIdentifier,
  pNumberList = _require.pNumberList,
  pOptionList = _require.pOptionList;
var _require2 = require('../utils'),
  makeNode = _require2.makeNode,
  makeList = _require2.makeList,
  streamline = _require2.streamline;
var _require3 = require('../index_definition'),
  pColumnIndex = _require3.pColumnIndex;
var _require4 = require('../constraint_definition'),
  pColumnConstraint = _require4.pColumnConstraint;
var pExpression = require('../expression');
var A = require('./actions');
var Lang = P.createLanguage({
  ColumnsDefinition: function ColumnsDefinition(r) {
    return P.alt(r.ComputedColumnDefinition.result(null), r.ColumnSetDefinition.result(null), r.ColumnDefinition);
  },
  ColumnDefinition: function ColumnDefinition(r) {
    return P.seqMap(pDotDelimitedName, r.DataType, P.alt(r.ColumnSetting, r.IgnoredColumnSetting.result(null)).many().fallback(null), A.makeColumn).thru(makeNode());
  },
  ColumnSetDefinition: function ColumnSetDefinition() {
    return P.seq(pIdentifier, KP.KeywordColumnSet);
  },
  ComputedColumnDefinition: function ComputedColumnDefinition() {
    return P.seq(pIdentifier, KP.KeywordAs, pExpression, P.seq(KP.KeywordPersisted, KP.KeywordNotNull.fallback(null)).fallback(null), pColumnConstraint.fallback(null));
  },
  ColumnSetting: function ColumnSetting(r) {
    return P.alt(r.NullOrNot, r.Identity, pColumnIndex, pColumnConstraint);
  },
  IgnoredColumnSetting: function IgnoredColumnSetting(r) {
    return P.alt(r.ColumnSetting1Word, r.ColumnSettingWith, r.ColumnSettingGAAR, r.ColumnSettingCollate);
  },
  DataType: function DataType(r) {
    return P.seqMap(pDotDelimitedName, makeList(P.alt(r.DataTypeXML, pIdentifier)).fallback(null), A.makeDataType);
  },
  DataTypeXML: function DataTypeXML() {
    return P.seq(P.alt(KP.KeywordDocument, KP.KeywordContent), pIdentifier).tieWith(' ');
  },
  NullOrNot: function NullOrNot() {
    return P.alt(KP.KeywordNull.result(false), KP.KeywordNotNull.result(true)).thru(streamline('not_null'));
  },
  Identity: function Identity() {
    return KP.KeywordIdentity.result(true).skip(pNumberList.fallback(null)).thru(streamline('increment'));
  },
  ColumnSetting1Word: function ColumnSetting1Word() {
    return P.alt(KP.KeywordFilestream, KP.KeywordNFR, KP.KeywordRowGUIDCol, KP.KeywordSparse);
  },
  ColumnSettingWith: function ColumnSettingWith() {
    return P.seq(P.alt(KP.KeywordMasked, KP.KeywordEncrypted), KP.KeywordWith, pOptionList);
  },
  ColumnSettingCollate: function ColumnSettingCollate() {
    return P.seq(KP.KeywordCollate, pIdentifier);
  },
  ColumnSettingGAAR: function ColumnSettingGAAR() {
    return P.seq(KP.KeywordGeneratedAAR, P.alt(KP.KeywordStart, KP.KeywordEnd), KP.KeywordHidden.fallback(null));
  }
});
module.exports = {
  pIdentity: Lang.Identity,
  pColumnIndex: pColumnIndex,
  pColumnConstraint: pColumnConstraint,
  pDataType: Lang.DataType,
  pColumnsDefinition: Lang.ColumnsDefinition
};