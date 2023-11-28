"use strict";

var pAlterTable = require('./alter_table');
var pCreateIndex = require('./create_index/index');
var pCreateTable = require('./create_table');
var pCommentSyntax = require('./comments');
module.exports = {
  pAlterTable: pAlterTable,
  pCreateIndex: pCreateIndex,
  pCreateTable: pCreateTable,
  pCommentSyntax: pCommentSyntax
};