const { Command } = require('@oclif/core');
const netrc = require('netrc-parser').default;
const { vars } = require('../vars');

class LogoutCommand extends Command {
  async run () {
    try {
      const { apiHost } = vars;
      await netrc.load();
      delete netrc.machines[apiHost];
      await netrc.save();
      this.log('Logout.');
    } catch (err) {
      this.error(err);
    }
  }
}

LogoutCommand.description = `logout
clears local login credentials
`;

module.exports = LogoutCommand;
