const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db", 
  database: "inventory_db", 
  password: "admin123", 
  port: 5432,
});

module.exports = pool;
