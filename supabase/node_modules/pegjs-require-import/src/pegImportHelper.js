const peg = require('pegjs');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

class PegImportHelper {
  constructor(loaderContext = {}) {
    this.loaderContext = loaderContext;
    this.pegContentParser = this.getPegContentParser();
    this.fileContentObj = {};
    this.graphState = {};
  }

  addLoaderDependency(filePath) {
    if (typeof this.loaderContext.addDependency === 'function') {
      this.loaderContext.addDependency(filePath);
    }
  }

  getPegContentParser() {
    const filePath = path.resolve(__dirname, './parser-pegjs.pegjs');
    const pegGrammar = fs.readFileSync(filePath, 'utf-8');
    this.addLoaderDependency(filePath);

    const pegContentParser = peg.generate(pegGrammar, {
      format: 'commonjs',
      dependencies: {
        _: 'lodash'
      }
    });
    return pegContentParser;
  }

  loadDependencies(normalizeFilePath) {
    this.graphState[normalizeFilePath] = 'EXPLORED';
    const dependencies = [];

    const fileContent = fs.readFileSync(normalizeFilePath, 'utf-8');
    this.addLoaderDependency(normalizeFilePath);
    const { initializer, content, dependencies: rawDependencies } = this.pegContentParser.parse(fileContent);
    this.fileContentObj[normalizeFilePath] = {
      initializer,
      content
    };

    rawDependencies.forEach((rawDependency) => {
      const nextNormalizeFilePath = path.resolve(path.dirname(normalizeFilePath), rawDependency);
      if (!this.graphState[nextNormalizeFilePath]) {
        this.loadDependencies(nextNormalizeFilePath).forEach((val) => {
          dependencies.push(val);
        });
      } else if (this.graphState[nextNormalizeFilePath] === 'EXPLORED') {
        throw Error(`Circular dependencies detected at ${nextNormalizeFilePath}`);
      }
    });

    this.graphState[normalizeFilePath] = 'VISITED';
    dependencies.push(normalizeFilePath);

    return dependencies;
  }

  generateAllFileContent(rootPath) {
    const normalizeRootPath = path.normalize(rootPath);
    const dependencies = this.loadDependencies(normalizeRootPath);
    let { initializer, content } = this.fileContentObj[normalizeRootPath];
    if (!initializer) {
      initializer = '';
    }
    _.pull(dependencies, normalizeRootPath);

    dependencies.forEach((filePath) => {
      const fileInitializer = this.fileContentObj[filePath].initializer;
      const fileContent = this.fileContentObj[filePath].content;
      if (fileInitializer) {
        initializer += `\n${fileInitializer}`;
      }
      content += `\n${fileContent}`;
    });

    const finalResult = `{\n${initializer}\n}\n${content}`;
    return finalResult;
  }

  generateParser(rootPath, options) {
    const data = this.generateAllFileContent(rootPath);
    const parser = peg.generate(data, options);
    return parser;
  }
}

module.exports = PegImportHelper;