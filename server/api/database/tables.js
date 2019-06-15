export const users = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false
  );
`;
export const orders = `
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    buyer INT NOT NULL,
    car_id INT NOT NULL,
    price_offered VARCHAR(128) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(16) DEFAULT 'pending',
    FOREIGN KEY (buyer) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;
export const cars = `
  CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    owner INT NOT NULL,
    name TEXT NOT NULL,
    manufacturer VARCHAR(128) NOT NULL,
    status VARCHAR(16) DEFAULT 'available',
    state VARCHAR(16) NOT NULL,
    price NUMERIC NOT NULL,
    model VARCHAR(128) NOT NULL,
    body_type VARCHAR(32) NOT NULL,
    image_urls text[] NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;
export const flags = `
  CREATE TABLE IF NOT EXISTS flags (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

export default users;
