const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");
const app = express();

// Use bodyParser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// SQL Injection Vulnerable Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Vulnerable SQL query (SQL Injection vulnerability)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log(`Executing SQL query: ${query}`); // Log the query for debugging

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("SQL error:", err); // Log the exact error
      res.status(500).send("Internal server error");
    } else if (row) res.send(`Welcome, ${row.username}!`);
    else res.send("Invalid credentials");
  });
});

/* SQL Injection examples

Logs in as the admin in the database, bypassing authentication
Username: admin' --
Password: anything

Logs in as the first user in the database (admin)
Username: anything
Password: ' OR 1=1 --

*/

// Serve index.html as the homepage
app.get("/", (res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
