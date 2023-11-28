const pattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const isValidUserName = (userName) => pattern.test(userName);

module.exports = {
  isValidUserName,
};
