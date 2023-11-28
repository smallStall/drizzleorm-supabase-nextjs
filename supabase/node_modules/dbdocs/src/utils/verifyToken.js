const netrc = require('netrc-parser').default;
const axios = require('axios');
const { vars } = require('../vars');

const verifyToken = async () => {
  const { apiHost } = vars;
  await netrc.load();
  const previousEntry = netrc.machines[apiHost];
  const dbdocsToken = process.env.DBDOCS_TOKEN;
  const isNotAuthenticated = (!previousEntry || !previousEntry.password) && !dbdocsToken;
  if (isNotAuthenticated) {
    throw new Error('Please login first.');
  }
  const authToken = dbdocsToken || netrc.machines[apiHost].password;
  const configuration = {
    headers: {
      Authorization: authToken,
      'Authorization-Method': dbdocsToken ? 'dbdocs-token' : 'login',
    },
  };
  await axios.get(`${vars.apiUrl}/account`, configuration)
    .catch((error) => {
      if (error.response && error.response.data.error.name === 'InvalidDbdocsToken') {
        throw new Error('Your DBDOCS_TOKEN is invalid, please setup a new one or remove it then login again.');
      }
      throw new Error('Invalid token. Please login again and/or check your DBDOCS_TOKEN.');
    });
  return configuration;
};

module.exports = verifyToken;
