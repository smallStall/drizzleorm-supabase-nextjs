"use strict";

var _ = require('lodash');
function makeDataType(typeName, args) {
  var argsString = args ? args.join(',') : null;
  return {
    type: 'type',
    value: {
      type_name: !argsString ? _.last(typeName) : "".concat(_.last(typeName), "(").concat(argsString, ")"),
      schemaName: typeName.length > 1 ? typeName[0] : null,
      args: argsString
    }
  };
}
function makeColumn(fieldName, dataType, fieldSettings) {
  var value = {};
  value[dataType.type] = dataType.value;
  fieldSettings.forEach(function (setting) {
    if (setting) value[setting.type] = setting.value;
  });
  value.name = fieldName[0];
  if (!value.inline_refs) value.inline_refs = [];
  return {
    type: 'fields',
    value: value
  };
}
module.exports = {
  makeColumn: makeColumn,
  makeDataType: makeDataType
};