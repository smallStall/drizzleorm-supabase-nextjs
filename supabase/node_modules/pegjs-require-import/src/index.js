const path = require('path');
const PegImportHelper = require('./pegImportHelper');

module.exports = function (rootPath, options) {
  const pegHelper = new PegImportHelper();
  return pegHelper.generateParser(path.resolve(path.dirname(module.parent.filename), rootPath), options); 
}