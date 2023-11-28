const { readKey, writeKey } = require('./data');

const BUILD_COUNT = 'BUILD_COUNT';

const shouldAskForFeedback = () => {
  const buildCount = parseInt(readKey(BUILD_COUNT));
  if (!buildCount) {
    writeKey(BUILD_COUNT, 1);
    return false;
  }
  if (buildCount < 2) {
    writeKey(BUILD_COUNT, buildCount + 1);
    return false;
  }
  return true;
}

module.exports = {
  shouldAskForFeedback
}