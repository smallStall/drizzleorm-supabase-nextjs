const { Command } = require('@oclif/core');
const inquirer = require('inquirer');
const axios = require('axios');
const ora = require('ora');
const { vars } = require('../vars');
const { isValidUserName } = require('../validators/userName');
const verifyToken = require('../utils/verifyToken');

async function enterUserName () {
  const answer = await inquirer.prompt([
    {
      message: 'Please input your new username: ',
      name: 'newUserName',
    },
  ]);
  return answer.newUserName;
}

async function validateAndUpdateUserName (spinner, authConfig, command) {
  let newUserName = await enterUserName();

  while (!isValidUserName(newUserName)) {
    spinner.warn('Invalid username! Username can only contain alphabets, numbers, "-" or "_" and can not be blanked!');
    newUserName = await enterUserName();
  }

  try {
    const { data: { user, hasRevokedToken } } = await axios.put(`${vars.apiUrl}/account/rename`, { newUserName }, authConfig);
    return { user, hasRevokedToken };
  } catch (err) {
    const { error } = err.response.data;
    const warningNames = ['UserNameNotChange', 'UserNameExisted'];
    if (warningNames.includes(error.name)) {
      spinner.warn(error.message);
    } else {
      command.error(error.message);
    }
    return { user: null, hasRevokedToken: null };
  }
}

class RenameCommand extends Command {
  async run () {
    const spinner = ora({});
    try {
      const authConfig = await verifyToken();

      this.warn('After renaming, your authentication token (if exists) will be revoked. Please re-generate a new one!');
      this.warn('You may need to re-login your account on the dbdocs web app for the best user experience.');

      let { user, hasRevokedToken } = await validateAndUpdateUserName(spinner, authConfig, this);
      while (!user) {
        ({ user, hasRevokedToken } = await validateAndUpdateUserName(spinner, authConfig, this));
      }
      if (hasRevokedToken) {
        spinner.succeed('Rename successfully and your access token has been revoked, please generate a new one!');
      } else {
        spinner.succeed('Rename successfully!');
      }
    } catch (err) {
      if (spinner.isSpinning) {
        spinner.fail();
      }
      let message = err.message || 'Something wrong :( Please try again.';
      if (err.response) {
        const { error } = err.response.data;
        switch (error.name) {
          case 'TokenExpiredError':
            message = 'Your token has expired. Please login again.';
            break;

          case 'InvalidAuthToken':
            message = 'Invalid token. Please login again.';
            break;

          default:
            message = error.message;
            break;
        }
      }
      this.error(message);
    }
  }
}

RenameCommand.description = 'change your username';

module.exports = RenameCommand;
