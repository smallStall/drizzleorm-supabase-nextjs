const pkg = require('../../../package.json');

module.exports = async function () {
  // update-notifier v6.x is pure ESM, can not use require() to load it,
  // see: https://github.com/yeoman/update-notifier/releases/tag/v6.0.0
  const updateNotifier = (await import('update-notifier')).default;
  const notifier = updateNotifier({ pkg });

  notifier.notify({ isGlobal: true });
  // uncomment to check the update information
  // console.log(await notifier.fetchInfo());
};
