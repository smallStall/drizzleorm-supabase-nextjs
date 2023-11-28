const getIsPublicValueFromBuildFlag = (publicFlag, privateFlag, passwordFlag) => {
  if (publicFlag || passwordFlag) return true;
  if (privateFlag) return false;
  return undefined; // 'undefined' means keep the old `isPublic` state
};

module.exports = {
  getIsPublicValueFromBuildFlag,
};
