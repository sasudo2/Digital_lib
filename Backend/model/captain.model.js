const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Captain {
  static async create({ firstname, lastname, email, password, vehicleColor, vehiclePlate, vehicleCapacity, vehicleType }) {
    const query = `
      INSERT INTO captains (firstname, lastname, email, password, vehicle_color, vehicle_plate, vehicle_capacity, vehicle_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, firstname, lastname, email, status, vehicle_color, vehicle_plate, vehicle_capacity, vehicle_type, created_at, updated_at
    `;
    const values = [firstname, lastname, email, password, vehicleColor, vehiclePlate, vehicleCapacity, vehicleType];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM captains WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM captains WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateSocketId(id, socketId) {
    const query = 'UPDATE captains SET socket_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [socketId, id]);
  }

  static async updateLocation(id, lat, lon) {
    const query = 'UPDATE captains SET location_lat = $1, location_lon = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3';
    await pool.query(query, [lat, lon, id]);
  }

  static generateAuthToken(captainId) {
    return jwt.sign({ id: captainId }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = Captain;