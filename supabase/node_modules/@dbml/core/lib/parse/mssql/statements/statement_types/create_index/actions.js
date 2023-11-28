"use strict";

var _require = require('../../../utils'),
  getFullTableName = _require.getFullTableName;
function makeIndex(_create, isUnique, _clustered, _index, indexName, _on, tableName, columnNames) {
  var fullTableName = getFullTableName(tableName);
  var columns = [];
  columnNames.forEach(function (columnName) {
    columns.push({
      value: columnName,
      type: 'column'
    });
  });
  return {
    type: 'indexes',
    value: {
      name: indexName,
      unique: isUnique ? true : null,
      tableName: fullTableName.name,
      schemaName: fullTableName.schemaName,
      columns: columns
    }
  };
}
module.exports = {
  makeIndex: makeIndex
};