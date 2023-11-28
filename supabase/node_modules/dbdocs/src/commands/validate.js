const { Command } = require('@oclif/core');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const parse = require('../utils/parse');

class ValidateCommand extends Command {
  async run () {
    const spinner = ora({});
    let filepath = null;
    try {
      const { args } = await this.parse(ValidateCommand);
      filepath = args.filepath;
      let content = '';
      content = fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf-8');

      spinner.text = 'Validating file content';
      spinner.start();

      await parse(content);
      spinner.succeed('Validating file content');
      spinner.succeed('Done. Parse succeeded without errors.');
    } catch (error) {
      let message = error.message || 'Something wrong :( Please try again.';
      if (filepath && error.location) message = `You have syntax error in ${path.basename(filepath)} line ${error.location.start.line} column ${error.location.start.column}. ${error.message}`;
      if (spinner.isSpinning) {
        spinner.fail(`Failed: ${message}`);
      } else {
        this.error(message);
      }
    }
  }
}

ValidateCommand.description = 'validate docs content';

ValidateCommand.flags = {};

ValidateCommand.args = [
  { name: 'filepath', description: 'dbml file path' },
];

module.exports = ValidateCommand;
