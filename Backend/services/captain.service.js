const Captain = require('../model/captain.model');

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  vehicleColor,
  vehiclePlate,
  vehicleCapacity,
  vehicleType,
}) => {
  if (!firstname || !email || !password || !vehicleColor || !vehiclePlate || !vehicleCapacity || !vehicleType) {
    throw new Error('All fields are required');
  }
  const captain = await Captain.create({
    firstname,
    lastname,
    email,
    password,
    vehicleColor,
    vehiclePlate,
    vehicleCapacity,
    vehicleType,
  });
  return captain;
};