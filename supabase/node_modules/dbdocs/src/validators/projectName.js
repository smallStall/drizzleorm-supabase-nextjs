const pattern = /^([A-Za-z0-9_\-@.\s]+)$/;
const isValidName = (name) => pattern.test(name);

module.exports = {
  isValidName
}