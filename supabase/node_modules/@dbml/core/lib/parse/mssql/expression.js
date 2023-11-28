"use strict";

var P = require('parsimmon');
var _ = require('lodash');
var _require = require('./base_parsers'),
  pFunction = _require.pFunction,
  pDotDelimitedName = _require.pDotDelimitedName,
  pConst = _require.pConst;
var _require2 = require('./keyword_parsers'),
  LParen = _require2.LParen,
  RParen = _require2.RParen;
var wss = require('./whitespaces');
var _require3 = require('./utils'),
  streamline = _require3.streamline;
function tokenizeParen(parser) {
  return parser.many().map(function (value) {
    return value.join('');
  }).fallback(null).thru(streamline('token'));
}
function enclose(parser) {
  var ManyRParen = RParen.thru(tokenizeParen);
  var ManyLParen = LParen.thru(tokenizeParen);
  return P.seq(ManyLParen, parser, ManyRParen);
}
function enclosedOrNot(parser) {
  return P.alt(enclose(parser), parser);
}
var Lang = P.createLanguage({
  ExpressionFinal: function ExpressionFinal(r) {
    return r.Expression.map(function (values) {
      var flattened = _.flattenDeep(values);
      return flattened.map(function (value) {
        return value ? value.value : '';
      }).join('');
    });
  },
  Expression: function Expression(r) {
    return enclosedOrNot(P.seq(P.alt(r.UnaryExpression, r.SimpleExpression), r.BinaryExpressionLR.fallback(null)).skip(wss));
  },
  UnaryExpression: function UnaryExpression(r) {
    var pUnaryOp = P.regex(/[+\-~]/).thru(streamline('unary_operator'));
    var pUnaryExp = P.seq(pUnaryOp, r.Expression).skip(wss);
    return enclosedOrNot(pUnaryExp);
  },
  BinaryExpressionLR: function BinaryExpressionLR(r) {
    var pBinaryOp = P.regexp(/[+\-*/%=!<>&^|]{1,2}/).map(function (operator) {
      return " ".concat(operator, " ");
    }).thru(streamline('binary_operator')).skip(wss);
    var pBinaryExp = P.seq(pBinaryOp, r.Expression).skip(wss);
    return pBinaryExp;
  },
  SimpleExpression: function SimpleExpression(r) {
    var pExp = P.alt(pFunction, pConst, r.ExpressionDDN).skip(wss);
    return enclosedOrNot(pExp);
  },
  ExpressionDDN: function ExpressionDDN() {
    return pDotDelimitedName.map(function (value) {
      return value.join('.');
    }).thru(streamline('identifier'));
  }
});
module.exports = Lang.ExpressionFinal;