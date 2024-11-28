# Basic Web Application Demonstrating Common Vulnerabilities

This project is a simple website created for **HB CyberTech** to demonstrate basic web application vulnerabilities, primarily focusing on **SQL Injection**. The goal is to teach about common security issues that exist in web applications and how they can be exploited if not handled properly.

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Vulnerabilities Demonstrated](#vulnerabilities-demonstrated)
4. [Setup](#setup)

---

## Overview

This project consists of a **frontend** built using HTML, CSS, and JavaScript, with a **backend** powered by **Node.js** and **SQLite**. The website is intentionally designed with common security vulnerabilities to showcase how attackers can exploit them to gain unauthorized access to the application.

---

## Technologies Used

- **Frontend**:

  - **HTML**: Used to build the basic structure of the website.
  - **CSS**: Used for styling the login page.
  - **JavaScript**: Used for handling requests and manipulating the DOM.

- **Backend**:

  - **Node.js**: JavaScript runtime to create the server and handle HTTP requests.
  - **Express.js**: Web framework for Node.js to simplify routing and handling HTTP requests.
  - **SQLite**: Lightweight SQL database to store user data (like usernames and passwords).

- **Tools**:
  - **Postman** or **Browser**: Used to test and interact with the application.

---

## Vulnerabilities Demonstrated

### 1. **SQL Injection (Authentication Bypass)**

How user input is directly used in SQL queries without validation or sanitization, which allows an attacker to manipulate the query and bypass authentication.

### 2. **Cross-Site Scripting (XSS)**

An attacker can inject malicious scripts into web pages viewed by other users, potentially leading to session hijacking, defacement, or redirection to malicious sites.

### 3. **Cross-Site Request Forgery (CSRF)**

An attacker tricks a user into submitting a request that they did not intend to using their cookie, potentially performing actions on behalf of the user without their consent.

### 4. **Open Redirect**

An attacker can redirect users to a malicious site by manipulating a URL parameter, potentially leading to phishing attacks or other malicious activities.

### 5. **Insecure Direct Object References (IDOR)**

An attacker can access or modify data they are not authorized to by manipulating input parameters, such as accessing another user's information by changing a user ID in the URL.

---

## Setup

Before you set up the project locally, install [Python](https://www.python.org/downloads/) and [NodeJS](https://nodejs.org/en/download/prebuilt-installer).

1. **Clone the repository**:

```sh
  git clone https://github.com/sachkeeratb/Vunerable-Website.git
```

2. **Navigate to the client directory and start the frontend server**:

```sh
  cd Vunerable-Website/client
  python3 -m http.server
```

3. **Navigate to the server directory and start the backend server in another terminal**:

```sh
  cd Vunerable-Website/client
  node server.js
```

Now, you can access the website on the default of http://localhost:3000 and start exploring.
