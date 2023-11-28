"use strict";

var isSchema = function isSchema(type) {
  return type.toLowerCase() === 'schema';
};
var isTable = function isTable(type) {
  return type.toLowerCase() === 'table';
};
var isColumn = function isColumn(type) {
  return type.toLowerCase() === 'column';
};
var isValidTableNote = function isValidTableNote(level) {
  return level.length === 2 && isSchema(level[0].type) && isTable(level[1].type);
};
var isValidColumnNote = function isValidColumnNote(level) {
  return level.length === 3 && isSchema(level[0].type) && isTable(level[1].type) && isColumn(level[2].type);
};
function handleComment(_ref) {
  var note = _ref.note,
    level = _ref.level;
  var type = 'unsupported';
  var schemaName = null;
  var tableName = null;
  var columnName = null;
  if (isValidTableNote(level)) {
    schemaName = level[0].name;
    tableName = level[1].name;
    // Table Comment
    type = 'table';
  } else if (isValidColumnNote(level)) {
    schemaName = level[0].name;
    tableName = level[1].name;
    columnName = level[2].name;
    type = 'column';
  }
  return {
    type: 'comment',
    value: {
      type: type,
      note: note,
      schemaName: schemaName,
      tableName: tableName,
      columnName: columnName
    }
  };
}
module.exports = {
  handleComment: handleComment
};