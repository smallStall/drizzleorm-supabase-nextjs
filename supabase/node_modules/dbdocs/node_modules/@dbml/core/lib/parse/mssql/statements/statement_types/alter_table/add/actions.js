"use strict";

var _require = require('../../../../constraint_definition'),
  makeTableConstraint = _require.makeTableConstraint;

// eslint-disable-next-line no-unused-vars
function makeDefault(_keyword, constExpression, _for, fieldName, _withValues) {
  var value = {};
  if (constExpression.type) {
    switch (constExpression.type) {
      case 'string':
      case 'number':
      case 'boolean':
        value.type = constExpression.type;
        break;
      default:
        value.type = 'expression';
        break;
    }
  } else {
    value.type = 'expression';
  }
  value.value = constExpression.value;
  value.fieldName = fieldName;
  return {
    type: 'dbdefault',
    value: value
  };
}
module.exports = {
  makeTableConstraint: makeTableConstraint,
  makeDefault: makeDefault
};