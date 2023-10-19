const properties = require("./json/properties.json");
const { Pool } = require("pg");

const CENT_TO_DOLLARS_FACTOR = 100;

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
  return pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, values)
    .then(response => {
      if (!response.rows[0]) {
        return null;
      }
      return response.rows[0];
    })
    .catch(err => {
      console.log(err);
      throw Error(err);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  return pool.query(`SELECT * FROM users WHERE id = $1 LIMIT 1;`, values)
    .then(response => {
      if (!response.rows[0]) {
        return null;
      }
      return response.rows[0];
    })
    .catch(error => {
      console.log(error);
      throw Error(error);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const values = [user.name, user.password, user.email];
  return getUserWithEmail(user.email)
    .then(response => {
      if (response) {
        throw Error('User email already exists');
      }
    })
    .then(() => pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *`, values))
    .then(res => {
      if (!res.rows[0].id) {
        throw Error('Something went wrong trying to return id from insert query.');
      }
      return { id: res.rows[0].id };
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// eslint-disable-next-line camelcase
const getAllReservations = function(guest_id, limit = 10) {
  if (limit > 10) {
    limit = 10;
  }
  // eslint-disable-next-line camelcase
  const values = [guest_id, limit];
  const sql = `
    SELECT r.id, p.title, r.start_date, p.cost_per_night, AVG(review.rating) as average_rating
    FROM property_reviews review
    JOIN properties p ON p.id = review.property_id
    JOIN reservations r ON r.id = review.reservation_id
    WHERE review.guest_id = $1
    GROUP BY r.id, p.id
    ORDER BY r.start_date ASC
    LIMIT $2
  `;
  return pool.query(sql, values)
    .then(response => response.rows)
    .catch(err => {
      console.log('getAllReservations error: ', err.message);
      throw err;
    });
};

/// Properties

const onlyMinRatingExists = (options) => {
  for (const optionKey in options) {
    if (options[optionKey] && optionKey !== 'minimum_rating') {
      return false;
    }
  }
  return true;
};

const placeAnd = (needsAnd) => needsAnd ? 'AND' : '';

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  console.log('options:', options);
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  let needsAnd = false;
  if (options && !onlyMinRatingExists(options)) {
    queryString += ` WHERE `;
  }

  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `${placeAnd(needsAnd)} properties.owner_id = $${queryParams.length} `;
    needsAnd = true;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${placeAnd(needsAnd)} city LIKE $${queryParams.length} `;
    needsAnd = true;
  }

  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `${placeAnd(needsAnd)} properties.owner_id = $${queryParams.length} `;
    needsAnd = true;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * CENT_TO_DOLLARS_FACTOR);
    queryString += `${placeAnd(needsAnd)} properties.cost_per_night >= $${queryParams.length} `;
    needsAnd = true;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night) * CENT_TO_DOLLARS_FACTOR);
    queryString += `${placeAnd(needsAnd)} properties.cost_per_night <= $${queryParams.length} `;
    needsAnd = true;
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then(res => res.rows)
    .catch(error => {
      console.log(error);
      throw error;
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
