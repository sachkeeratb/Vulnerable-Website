const express = require("express");
const db = require("./db");
const path = require("path");
const app = express();

// Use express to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client folder
app.use(express.static(path.join(__dirname, "../client")));

// Route for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Route for the SQL Injection page
app.get("/sql-injection", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/sql-injection.html"));
});

// Route for the XSS page
app.get("/xss", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/xss.html"));
});

// SQL Injection
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Vulnerable SQL query (SQL Injection vulnerability)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log(`Executing SQL query: ${query}`); // Log the query for debugging

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("SQL error:", err); // Log the exact error
      res.status(500).send("Internal server error");
    } else if (row) res.json({ success: true, username: row.username });
    else res.json({ success: false });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
