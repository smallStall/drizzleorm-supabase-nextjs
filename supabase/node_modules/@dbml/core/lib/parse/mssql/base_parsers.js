"use strict";

var P = require('parsimmon');
var _require = require('./utils'),
  makeList = _require.makeList,
  streamline = _require.streamline;
var KP = require('./keyword_parsers');
var wss = require('./whitespaces');
var _pIgnore = P(function (input, i) {
  var j = i;
  var isEnclosed = false;
  var encloseChar = '';
  while (j < input.length && (isEnclosed || !input.slice(j, j + 2).match(/GO|;/i))) {
    if (isEnclosed && input[j].match(/\]|'|"/i) && input[j] === encloseChar) {
      isEnclosed = false;
    } else if (!isEnclosed && input[j].match(/\[|"|'/i)) {
      isEnclosed = true;
      encloseChar = input[j];
      if (input[j] === '[') encloseChar = ']';
    }
    if (!input[j].match(/\s/)) j += 1;
    while (j < input.length && input[j].match(/\s/)) {
      j += 1;
    }
  }
  if (input.slice(j, j + 2).match(/GO/i)) j -= 1;
  return P.makeSuccess(j + 1, '');
});
var Lang = P.createLanguage({
  pIgnore: function pIgnore() {
    return _pIgnore;
  },
  pColumnNames: function pColumnNames(r) {
    return makeList(P.seq(r.pIdentifier, r.pKeywordAscOrDesc.fallback(null)).map(function (value) {
      return value[0];
    })).desc('list of column names');
  },
  pDotDelimitedName: function pDotDelimitedName(r) {
    return P.sepBy1(r.pIdentifier, P.string('.')).desc('dot delimited identifier');
  },
  pOptionList: function pOptionList(r) {
    return makeList(r.pOption);
  },
  pOption: function pOption(r) {
    return P.seq(r.pIdentifier, KP.Equal, P.seq(P.alt(r.pIdentifier, r.pString).many(), P.alt(r.pOptionList, makeList(r.pIdentifier.many())).fallback(null))).desc('option');
  },
  pComparsionOp: function pComparsionOp() {
    return P.regex(/IS|IS[^\S\r\n]+NOT|=|<>|!=|>|>=|!>|<|<=|!</i).skip(wss).desc('comparsion operator');
  },
  // SQL SERVER do not support boolean literal
  pConst: function pConst(r) {
    return P.alt(r.pString, r.pUnicode, r.pBinary, r.pScience, r.pMoney, r.pSigned, r.pNumber).desc('constant');
  },
  pFunction: function pFunction(r) {
    return P.seq(r.pIdentifier, makeList(r.pFunctionParam, true)).map(function (value) {
      return "".concat(value[0], "(").concat(value[1].join(','), ")");
    }).thru(streamline('function')).desc('function constant');
  },
  pFunctionParam: function pFunctionParam(r) {
    return P.alt(r.pNumber, r.pIdentifier).desc('identifier or number paremeter');
  },
  pMoney: function pMoney(r) {
    return P.seq(P.regexp(/[+-]\$/), r.pNumber).thru(streamline('money')).desc('money constant');
  },
  pSigned: function pSigned(r) {
    return P.seq(P.regexp(/[+-]/), r.pNumber).thru(streamline('signed')).desc('signed constant');
  },
  pUnicode: function pUnicode(r) {
    return P.seq(P.string('N'), r.pString).thru(streamline('unicode')).desc('unicode constant');
  },
  pString: function pString() {
    return P.regexp(/'[^']*'/).thru(streamline('string')).map(function (value) {
      var stringLiteral = value.value;
      value.value = stringLiteral.slice(1, stringLiteral.length - 1);
      return value;
    }).desc('string constant');
  },
  pNumberList: function pNumberList(r) {
    return makeList(r.pNumber).desc('list of number');
  },
  pNumber: function pNumber() {
    return P.regexp(/[0-9]+(\.[0-9]+)?/).map(Number).thru(streamline('number')).desc('number constant');
  },
  pBinary: function pBinary() {
    return P.regexp(/0x[A-F0-9]*/).thru(streamline('binary')).desc('binary constant');
  },
  pScience: function pScience() {
    return P.regexp(/[+-]+[0-9]+(\.[0-9E]+)?/).thru(streamline('science')).desc('science constant');
  },
  pIdentifier: function pIdentifier(r) {
    return P.alt(r.pRegularIdentifier, r.pDelimitedIdentifier).skip(wss).desc('identifier');
  },
  pDelimitedIdentifier: function pDelimitedIdentifier(r) {
    return P.alt(r.pDQDelimitedIdentifier, r.pBracketDelimitedIdentifier).skip(wss).desc('delimited identifier');
  },
  pRegularIdentifier: function pRegularIdentifier() {
    return P.regexp(/^[\w@#][\w@#$]*/).skip(wss);
  },
  pDQDelimitedIdentifier: function pDQDelimitedIdentifier() {
    return P.seq(P.string('"'), P.regexp(/[^"]*/), P.string('"')).map(function (value) {
      return value[1];
    }).skip(wss);
  },
  pBracketDelimitedIdentifier: function pBracketDelimitedIdentifier() {
    return P.seq(P.string('['), P.regexp(/[^\]]*/), P.string(']')).map(function (value) {
      return value[1];
    }).skip(wss);
  },
  pKeywordPKOrUnique: function pKeywordPKOrUnique() {
    return P.alt(KP.KeywordPrimaryKey.result({
      type: 'pk',
      value: true
    }), KP.KeywordUnique.result({
      type: 'unique',
      value: true
    }));
  },
  pKeywordClusteredOrNon: function pKeywordClusteredOrNon() {
    return P.alt(KP.KeywordClustered, KP.KeywordNonclustered);
  },
  pKeywordAscOrDesc: function pKeywordAscOrDesc() {
    return P.alt(KP.KeywordAsc, KP.KeywordDesc);
  }
});
module.exports = Lang;