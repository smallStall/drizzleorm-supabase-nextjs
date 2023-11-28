const pattern = /^[0-9]{6,8}$/;
const isValidOtp = (otp) => pattern.test(otp);

module.exports = {
  isValidOtp,
};
