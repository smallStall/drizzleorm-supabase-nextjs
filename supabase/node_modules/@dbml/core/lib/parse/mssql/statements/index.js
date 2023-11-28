"use strict";

var P = require('parsimmon');
var KP = require('../keyword_parsers');
var S = require('./statement_types');
var wss = require('../whitespaces');
var A = require('./actions');
var _require = require('../base_parsers'),
  pIgnore = _require.pIgnore;
var Lang = P.createLanguage({
  Statements: function Statements(r) {
    return wss.then(r.Seperator).then(P.sepBy(r.StatementTypes, r.Seperator)).skip(r.Seperator).map(A.handleStatement);
  },
  StatementTypes: function StatementTypes(r) {
    return P.alt(S.pCreateIndex, S.pCreateTable, S.pAlterTable, S.pCommentSyntax, r.IgnoredStatementTypes);
  },
  IgnoredStatementTypes: function IgnoredStatementTypes(r) {
    return P.seq(r.IgnoredStatementSyntax, pIgnore);
  },
  IgnoredStatementSyntax: function IgnoredStatementSyntax(r) {
    return P.alt(r.IgnoredDDLSyntax, r.IgnoredDMLSyntax, r.IgnoredBackupAndRestoreSyntax, r.IgnoredServiceBrokerSyntax, r.IgnoredPermissionSyntax, KP.KeywordAdd, KP.KeywordClose, KP.KeywordSet, KP.KeywordIf);
  },
  IgnoredDDLSyntax: function IgnoredDDLSyntax(r) {
    return P.alt(r.KeywordCreateWithoutTable, r.KeywordAlterWithoutTable, KP.KeywordCollate, KP.KeywordDrop, KP.KeywordRename, KP.KeywordEnable, KP.KeywordDisable);
  },
  IgnoredDMLSyntax: function IgnoredDMLSyntax() {
    return P.alt(KP.KeywordBulkInsert, KP.KeywordInsert, KP.KeywordUpdate, KP.KeywordMerge, KP.KeywordTruncateTable, KP.KeywordDelete);
  },
  IgnoredServiceBrokerSyntax: function IgnoredServiceBrokerSyntax() {
    return P.alt(KP.KeywordBegin, KP.KeywordEnd, KP.KeywordMove, KP.KeywordReceive, KP.KeywordSend);
  },
  IgnoredPermissionSyntax: function IgnoredPermissionSyntax() {
    return P.alt(KP.KeywordDeny, KP.KeywordExecute, KP.KeywordGrant, KP.KeywordOpen, KP.KeywordRevoke);
  },
  IgnoredBackupAndRestoreSyntax: function IgnoredBackupAndRestoreSyntax() {
    return P.alt(KP.KeywordBackup, KP.KeywordRestore);
  },
  KeywordCreateWithoutTable: function KeywordCreateWithoutTable() {
    return KP.KeywordCreate.notFollowedBy(KP.KeywordTable);
  },
  KeywordAlterWithoutTable: function KeywordAlterWithoutTable() {
    return KP.KeywordAlter.notFollowedBy(KP.KeywordTable);
  },
  Seperator: function Seperator() {
    return P.alt(KP.Semicolon, KP.KeywordGo, P.seq(KP.Semicolon, KP.KeywordGo)).many();
  }
});
module.exports = Lang.Statements;