const { Command } = require('@oclif/core');
const open = require('open');
const inquirer = require('inquirer');
const axios = require('axios');
const ora = require('ora');
const netrc = require('netrc-parser').default;
const { vars } = require('../vars');
const { isValidEmail } = require('../validators/email');
const { isValidOtp } = require('../validators/otp');
const { LOGIN_METHODS } = require('../utils/constants');

async function askForOtp (spinner, shortLivedToken, email) {
  const cliSpinner = spinner;
  const otpAnswer = await inquirer.prompt([
    {
      message: 'Please input OTP code sent to the email:',
      name: 'otp',
      validate: (otp) => (isValidOtp(otp) ? true : 'OTP invalid, please try again'),
    },
  ]);

  const { otp } = otpAnswer;

  cliSpinner.text = 'Login to your account';
  cliSpinner.start();
  const { data: { token } } = await axios.post(
    `${vars.apiUrl}/auth`,
    {
      params: {
        authCode: otp,
        provider: 'email',
        shortLivedToken,
        loginEmail: email,
      },
    },
  );
  cliSpinner.succeed();

  return token;
}

async function loginViaEmail (spinner) {
  const cliSpinner = spinner;
  const emailAnswer = await inquirer.prompt([
    {
      message: 'Your email:',
      name: 'email',
      validate: (email) => (isValidEmail(email) ? true : 'Email invalid, please try again'),
    },
  ]);

  const { email } = emailAnswer;

  cliSpinner.text = 'Request email authentication';
  cliSpinner.start();
  const { data: { shortLivedToken } } = await axios.post(
    `${vars.apiUrl}/auth/email`,
    {
      params: {
        email,
      },
    },
  );
  cliSpinner.succeed();

  // TODO: allow user to retry input the OTP
  const token = await askForOtp(spinner, shortLivedToken, email);

  return token;
}

class LoginCommand extends Command {
  async run () {
    const spinner = ora({});
    try {
      const loginMethodAnswer = await inquirer.prompt([
        {
          type: 'rawlist',
          message: 'Choose a login method:',
          choices: [
            { name: 'Email', value: LOGIN_METHODS.EMAIL },
            { name: 'GitHub/Google', value: LOGIN_METHODS.GITHUB_GOOGLE },
          ],
          name: 'loginMethod',
        },
      ]);

      const { loginMethod } = loginMethodAnswer;

      let authToken;

      if (loginMethod === LOGIN_METHODS.EMAIL) {
        authToken = await loginViaEmail(spinner);
      } else {
        await open(`${vars.hostUrl}/login/cli`, { wait: false });
        const answer = await inquirer.prompt([
          {
            message: 'Please input your authentication token: ',
            name: 'authToken',
          },
        ]);

        authToken = answer.authToken;
      }

      spinner.text = 'Validate token';
      spinner.start();
      const { data: { account } } = await axios.get(`${vars.apiUrl}/account`, {
        headers: {
          Authorization: authToken,
          'Authorization-Method': 'login',
        },
      });
      spinner.succeed();

      spinner.text = 'Save credential';
      spinner.start();
      const { apiHost } = vars;
      await netrc.load();
      const previousEntry = netrc.machines[apiHost];
      if (!previousEntry) {
        netrc.machines[apiHost] = {};
      }
      netrc.machines[apiHost].login = account.email;
      netrc.machines[apiHost].password = authToken;
      await netrc.save();
      spinner.succeed();

      this.log('\nDone.');
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

          case 'OtpInvalidError':
            message = 'Invalid OTP. Please login again.';
            break;

          case 'OtpUsedError':
            message = 'OTP used recently. Please login again after couple minutes.';
            break;

          case 'EmailDeliveryFailedError':
            message = 'Email delivery failed. Please login again.';
            break;

          default:
            break;
        }
      }
      this.error(message);
    }
  }
}

LoginCommand.description = `login to dbdocs
login with your dbdocs credentials
`;

module.exports = LoginCommand;
