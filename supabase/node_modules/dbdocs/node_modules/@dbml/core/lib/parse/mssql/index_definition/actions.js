"use strict";

function makeIndex(columnNames, isUnique, isPk) {
  var indexName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var columns = [];
  columnNames.forEach(function (column) {
    columns.push({
      value: column,
      type: 'column'
    });
  });
  return {
    type: 'indexes',
    value: {
      name: indexName,
      unique: isUnique ? true : null,
      pk: isPk ? true : null,
      columns: columns
    }
  };
}
function makeColumnIndex(_keyword, indexName) {
  return {
    type: 'indexes',
    value: {
      name: indexName,
      columns: []
    }
  };
}
function makeTableIndex(_keyword, indexName, isUnique, _clustered, _columnstore, columnNames) {
  return makeIndex(columnNames, isUnique, null, indexName);
}
function makeTableConstraintIndex(keyword, _keyword, columnNames) {
  var isPk = null;
  var isUnique = null;
  if (keyword.type === 'pk') {
    isPk = true;
  } else if (keyword.type === 'unique') {
    isUnique = true;
  }
  return makeIndex(columnNames, isUnique, isPk);
}
module.exports = {
  makeTableIndex: makeTableIndex,
  makeTableConstraintIndex: makeTableConstraintIndex,
  makeColumnIndex: makeColumnIndex
};