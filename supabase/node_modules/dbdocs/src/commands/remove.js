/* eslint-disable camelcase */
const { Command } = require('@oclif/core');
const axios = require('axios');
const inquirer = require('inquirer');
const ora = require('ora');
const { vars } = require('../vars');
const verifyToken = require('../utils/verifyToken');
const { getOrg } = require('../utils/org');

const remove = async (projectName, org, authConfig) => {
  const encodedProjectName = encodeURIComponent(decodeURIComponent(projectName));
  await axios.delete(`${vars.apiUrl}/projects/${encodedProjectName}`, {
    ...authConfig,
    data: org,
  });
};

class RemoveCommand extends Command {
  async run () {
    const spinner = ora({});
    try {
      const authConfig = await verifyToken();
      const org = await getOrg(authConfig);

      const { args } = await this.parse(RemoveCommand);
      let { project_name } = args;
      if (!project_name) {
        const answer = await inquirer.prompt([
          {
            message: 'Project name: ',
            name: 'project',
          },
        ]);
        project_name = answer.project;
      }

      spinner.text = 'Removing project';
      spinner.start();

      await remove(project_name, org, authConfig);

      spinner.succeed('Removed successfully');
    } catch (err) {
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
      if (spinner.isSpinning) {
        spinner.fail(`Failed: ${message}`);
      } else {
        this.error(message);
      }
    }
  }
}

RemoveCommand.description = 'remove project';

RemoveCommand.args = [
  { name: 'project_name', description: 'name of the project which you want to remove' },
];

module.exports = RemoveCommand;
