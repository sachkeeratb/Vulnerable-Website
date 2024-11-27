const express = require("express");
const session = require("express-session");
const db = require("./db");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use express to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser to parse cookies
app.use(cookieParser());

// Use cors to allow cross-origin requests
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "*", // Allow all HTTP methods
    allowedHeaders: "*", // Allow all headers
  })
);

// Use express-session to manage user sessions
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

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

// Route for the CSRF page
app.get("/csrf", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/csrf.html"));
});

app.get("/open-redirect", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/open-redirect.html"));
});

// Route for the Open Redirect page
app.get("/redirect", (req, res) => {
  const { url } = req.query;
  if (url) res.redirect(301, url);
  else {
    res.status(400).send("Bad Request: Missing URL parameter");
  }
});

// Route for the IDOR page
app.get("/idor", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/idor.html"));
});

// CSRF Transfer endpoint
app.post("/transfer", (req, res) => {
  console.log(req.cookies);
  const username = req.cookies.username;
  if (!username) return res.status(401).send("Unauthorized");

  const { amount } = req.body;
  console.log(`Transferred ${amount}`);
  res.send({ success: true, transferred: amount });
});

// Open Redirect endpoint
app.get("/redirect", (req, res) => {
  const { url } = req.query;
  res.redirect(url);
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
    } else if (row) {
      req.session.user = row.username;
      res.json({ success: true, username: row.username });
    } else res.json({ success: false });
  });
});

// IDOR User Info endpoint
app.get("/user", (req, res) => {
  const { userId } = req.query;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.get(query, [], (err, row) => {
    if (err) {
      console.error("SQL error:", err);
      res.status(500).send("Internal server error");
    } else if (row) res.json(row);
    else res.status(404).send("User not found");
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
