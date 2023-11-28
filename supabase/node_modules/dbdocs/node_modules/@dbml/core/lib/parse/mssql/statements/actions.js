"use strict";

var _ = require('lodash');
function findTable(ast, tableName, schemaName) {
  var realSchemaName = schemaName || 'public';
  var table = ast.tables.find(function (t) {
    var targetSchemaName = t.schemaName || 'public';
    return targetSchemaName === realSchemaName && t.name === tableName;
  });
  return table;
}
function findField(table, fieldName) {
  return table.fields.find(function (_field) {
    return _field.name === fieldName;
  });
}
function handleIndexes(index, ast) {
  var table = findTable(ast, index.tableName, index.schemaName);
  table.indexes.push(index);
  index.tableName = null;
}
function pushOut(values, astProp) {
  values.forEach(function (value) {
    astProp.push(value);
  });
}
function handleTable(table, ast) {
  pushOut(table.enums, ast.enums);
  pushOut(table.refs, ast.refs);
  table.enums.forEach(function (_enum) {
    _enum.fieldName = null;
  });
  table.enums = null;
  table.refs = null;
}
function handleDefaults(dbdefault, ast) {
  var table = findTable(ast, dbdefault.tableName, dbdefault.schemaName);
  var field = findField(table, dbdefault.fieldName);
  dbdefault.fieldName = null;
  dbdefault.tableName = null;
  field.dbdefault = dbdefault;
}
function handleEnums(_enum, ast) {
  var table = findTable(ast, _enum.tableName, _enum.schemaName);
  var field = findField(table, _enum.fieldName);
  _enum.name = "".concat(_enum.tableName, "_").concat(_enum.fieldName, "_enum");
  _enum.fieldName = null;
  _enum.tableName = null;
  field.type.type_name = _enum.name;
  field.type.args = _enum.values.map(function (value) {
    return "'".concat(value.name, "'");
  }).join(', ');
}
function handleTableNote(comment, ast) {
  var schemaName = comment.schemaName;
  if (schemaName === 'dbo') schemaName = null; // treat `dbo` as public schema
  var foundTable = findTable(ast, comment.tableName, schemaName);
  if (foundTable) foundTable.note = comment.note ? {
    value: comment.note
  } : null;
}
function handleFieldNote(comment, ast) {
  var schemaName = comment.schemaName;
  if (schemaName === 'dbo') schemaName = null; // treat `dbo` as public schema
  var foundTable = findTable(ast, comment.tableName, schemaName);
  if (foundTable) {
    var foundField = findField(foundTable, comment.columnName);
    if (foundField) foundField.note = comment.note ? {
      value: comment.note
    } : null;
  }
}
function handleComment(comment, ast) {
  if (comment.type === 'table') handleTableNote(comment, ast);else if (comment.type === 'column') handleFieldNote(comment, ast);
}
function handleStatement(_statements) {
  var ast = {
    tables: [],
    refs: [],
    indexes: [],
    enums: []
  };
  var statements = _.flatten(_statements);
  statements.forEach(function (statement) {
    if (!statement) return;
    switch (statement.type) {
      case 'tables':
        handleTable(statement.value, ast);
        break;
      // from alter table add
      case 'indexes':
        handleIndexes(statement.value, ast);
        break;
      case 'dbdefault':
        handleDefaults(statement.value, ast);
        break;
      case 'enums':
        handleEnums(statement.value, ast);
        break;
      case 'comment':
        handleComment(statement.value, ast);
        break;
      default:
        break;
    }
    if (statement.type && ast[statement.type]) ast[statement.type].push(statement.value);
  });
  ast.indexes = null;
  return ast;
}
module.exports = {
  handleStatement: handleStatement
};