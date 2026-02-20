const Captain = require('../model/captain.model');

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error('All required fields must be provided');
  }
  const captain = await Captain.create({
    firstname,
    lastname,
    email,
    password,
  });
  return captain;
};