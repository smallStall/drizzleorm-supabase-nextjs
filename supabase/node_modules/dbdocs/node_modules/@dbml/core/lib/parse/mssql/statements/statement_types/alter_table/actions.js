"use strict";

var _ = require('lodash');
var _require = require('../../../utils'),
  getFullTableName = _require.getFullTableName;
function handleRef(tableName, result) {
  var endpointWithNoTableName = result.value.endpoints.find(function (ele) {
    return !ele.tableName;
  });
  endpointWithNoTableName.tableName = tableName.name;
  endpointWithNoTableName.schemaName = tableName.schemaName;
}
function addTableName(tableName, result) {
  result.value.tableName = tableName.name;
  result.value.schemaName = tableName.schemaName;
}
function handleAlterTableResult(_keyword, tableName, results) {
  if (!results) return null;
  var fullName = getFullTableName(tableName);
  // eslint-disable-next-line consistent-return
  results.forEach(function (result) {
    if (result) {
      switch (result.type) {
        case 'refs':
          handleRef(fullName, result);
          break;
        case 'indexes':
        case 'dbdefault':
        case 'enums':
          addTableName(fullName, result);
          break;
        default:
          break;
      }
    }
  });
  return results;
}
module.exports = {
  handleAlterTableResult: handleAlterTableResult
};