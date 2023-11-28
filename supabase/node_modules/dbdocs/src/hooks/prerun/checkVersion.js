const { getVersion, getPackageVersion, compareVersion } = require('./helper');

module.exports = async function () {
  let shouldExit = false;
  try {
    const localVersion = getPackageVersion();
    const remoteVersion = await getVersion();
    const mustUpgrade = compareVersion(localVersion, remoteVersion.required) === -1;
    if (mustUpgrade) {
      shouldExit = true;
      this.error('Your CLI version is no longer supported, please upgrade with "npm i -g dbdocs"');
    }
    const shouldUpgrade = compareVersion(localVersion, remoteVersion.current) === -1;
    if (shouldUpgrade) this.warn('A new version is available, use "npm i -g dbdocs" to upgrade to the latest version');
  } catch (err) {
    const message = err.message || 'Something goes wrong when checking version';
    if (shouldExit) this.error(message);
    this.warn(message);
  }
};
