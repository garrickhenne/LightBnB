const properties = require("./json/properties.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const values = [email];
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, values)
      .then(response => {
        if (!response.rows[0]) {
          resolve(null);
          return;
        }
        resolve(response.rows[0]);
      })
      .catch(err => {
        console.log(err);
        return reject(err);
      });
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return new Promise((resolve, reject) => {
    const values = [id];
    pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1;`, values)
      .then(response => {
        if (!response.rows[0]) {
          return resolve(null);
        }
        return resolve(response.rows[0]);
      })
      .catch(error => {
        console.log(error);
        return reject(error);
      });
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return new Promise((resolve, reject) => {
    const values = [user.name, user.password, user.email];
    getUserWithEmail(user.email)
      .then(response => {
        if (response) {
          throw Error('User email already exists');
        }
      })
      .then(() => {
        pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *`, values)
          .then(res => {
            if (!res.rows[0].id) {
              reject('Something went wrong trying to return id from insert query.');
              return;
            }
            return resolve({ id: res.rows[0].id });
          });
      })
      .catch(error => reject(error));
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM properties LIMIT $1`, [limit])
      .then(res => {
        resolve(res.rows);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
