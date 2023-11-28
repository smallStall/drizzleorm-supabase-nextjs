const axios = require('axios');
const { vars } = require('../../vars');
const pkg = require('../../../package.json');

const getVersion = async () => {
  const res = await axios.get(`${vars.apiUrl}/version/cli`);
  return res.data;
};
const getPackageVersion = () => {
  const ver = pkg.version;
  const [major, minor, patch] = ver.split('.');
  return { major, minor, patch };
};

/**
 * @param {{major: number, minor: number, patch: number}} a: version to compare
 * @param {{major: number, minor: number, patch: number}} b: version to compare to
 * @returns {number}
 * 0: a = b;
 * 1: a > b;
 * -1: a < b;
 */
const compareVersion = (a, b) => {
  if (a.major > b.major) return 1;
  if (a.major < b.major) return -1;
  if (a.minor > b.minor) return 1;
  if (a.minor < b.minor) return -1;
  if (a.patch > b.patch) return 1;
  if (a.patch < b.patch) return -1;
  return 0;
};

module.exports = {
  getVersion,
  getPackageVersion,
  compareVersion,
};
