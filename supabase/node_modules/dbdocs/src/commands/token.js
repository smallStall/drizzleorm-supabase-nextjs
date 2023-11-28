const { Command, Flags } = require('@oclif/core');
const ora = require('ora');
const axios = require('axios');
const { vars } = require('../vars');
const verifyToken = require('../utils/verifyToken');

class TokenCommand extends Command {
  async run () {
    const spinner = ora({});
    const { flags: { generate, revoke } } = await this.parse(TokenCommand);
    if (!generate && !revoke) {
      this.error('Please specify an action, type "dbdocs token --help" to see processable actitons.');
    }
    if (generate && revoke) {
      this.error('Please specify only one action.');
    }
    spinner.start('Verify your identity.');
    const authConfig = await verifyToken().catch((error) => {
      spinner.fail();
      return Promise.reject(error);
    });
    spinner.succeed();
    try {
      if (generate) {
        spinner.start('Generating your access token');
        const { data: { token } } = await axios.post(`${vars.apiUrl}/tokens`, {}, authConfig);
        spinner.succeed(`Your access token is: ${token}`);
        this.warn('Please save this token. You cannot see it again.');
      } else {
        spinner.start('Revoking your access token');
        await axios.delete(`${vars.apiUrl}/tokens`, authConfig);
        spinner.succeed('Your access token has been revoked');
      }
    } catch (error) {
      if (error.response) {
        const { name } = error.response.data.error;
        switch (name) {
          case 'TokenGeneratedError':
            spinner.fail('You already have a token generated. Please revoke it before generating a new one.');
            this.log('To remove the existing token, run "dbdocs token -r"');
            break;
          case 'NotFound':
            spinner.fail('You do not have any token to revoke.');
            break;
          default:
            spinner.fail();
            this.error(error.message);
        }
      } else {
        spinner.fail();
        this.error(error.message);
      }
    }
  }
}

TokenCommand.description = 'generate or revoke your authentication token';
TokenCommand.flags = {
  generate: Flags.boolean({
    char: 'g',
    description: 'generate authentication token',
    default: false,
  }),
  revoke: Flags.boolean({
    char: 'r',
    description: 'revoke authentication token',
    default: false,
  }),
};
module.exports = TokenCommand;
