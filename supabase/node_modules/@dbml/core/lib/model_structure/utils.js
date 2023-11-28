"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldPrintSchema = shouldPrintSchema;
exports.shouldPrintSchemaName = shouldPrintSchemaName;
var _config = require("./config");
function shouldPrintSchema(schema) {
  return schema.name !== _config.DEFAULT_SCHEMA_NAME || schema.name === _config.DEFAULT_SCHEMA_NAME && schema.database.hasDefaultSchema;
}
function shouldPrintSchemaName(schemaName) {
  return schemaName !== _config.DEFAULT_SCHEMA_NAME;
}