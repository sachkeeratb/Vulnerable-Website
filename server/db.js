const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

// Create a users table
db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)"
  );

  // Insert sample users
  db.run(
    "INSERT INTO users (username, password) VALUES ('admin', 'password123')"
  );
  db.run("INSERT INTO users (username, password) VALUES ('user', 'userpass')");
  db.run("INSERT INTO users (username, password) VALUES ('john', 'smith')");
});

module.exports = db;
