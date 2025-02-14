# Authentication API with Express & MongoDB

## 📌 Project Overview

This is a simple authentication API built using **Express.js** and **MongoDB** with JWT-based authentication and password hashing using **bcrypt**. The API includes routes for **user registration, login, and user search**.

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **bcrypt** (for password hashing)
- **jsonwebtoken (JWT)** (for authentication)
- **dotenv** (for environment variables)
- **body-parser** (for parsing requests)

## 🚀 Features

- **User Registration** with hashed passwords
- **User Login** with JWT token generation (expires in 5 minutes)
- **User Search** (JWT token required)
- **Error Handling & Input Validation**
- **Username & Full Name Validation** using Mongoose
- **Custom Password Validation**

---

## 📂 Project Setup

### 1️⃣ Clone the Repository

```sh
git clone <repo-url>
cd <project-folder>
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Create a `.env` File

Create a `.env` file in the root directory and add the following:

```env
SESSION_SECRET=your_secret_key
MONGODB_CONNECTION_STRING=your_mongodb_connection_url
BASE_PORT=3000
```

### 4️⃣ Start the Server

```sh
npm start
```

Server runs at `http://localhost:3000`

---

## 📌 API Endpoints

### 🔹 1️⃣ **User Registration**

**Endpoint:** `POST /register`

#### ✅ Request Body:

```json
{
  "username": "john_doe",
  "password": "securepassword",
  "fullName": "John Doe",
  "gender": "Male",
  "dateOfBirth": "1995-06-15",
  "country": "USA"
}
```

#### 📌 Response:

```json
{
  "msg": "Registration successful",
  "UserInfo": {
    "username": "john_doe",
    "password": "hashedsecurepassword",
    "fullName": "John Doe",
    "gender": "Male",
    "dateOfBirth": "1995-06-15",
    "country": "USA"
  }
}
```

#### 🚫 Response (if user already exists):

```json
{
  "msg": "User already exists, try signing in"
}
```

#### ✅ Input Validation:

- **Username**: Must not be all numbers, at least 3 characters
- **Full Name**: Only alphabets and spaces allowed
- **Password**: At least 8 characters (custom validation)

---

### 🔹 2️⃣ **User Login**

**Endpoint:** `POST /login`

#### ✅ Request Body:

```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

#### 📌 Response:

```json
{
  "msg": "Login Successful",
  "Token": "your_generated_jwt_token"
}
```

#### 🚫 Response (if user not found):

```json
{
  "msg": "User Not Found, Create an Account",
  "token": false
}
```

#### 🚫 Response (if password incorrect):

```json
{
  "msg": "Incorrect Password",
  "token": false
}
```

---

### 🔹 3️⃣ **Search User (Protected Route)**

**Endpoint:** `GET /searchuser`

#### ✅ Headers:

```json
{
  "Authorization": "Bearer your_generated_jwt_token"
}
```

#### ✅ Request Body:

```json
{
  "username": "john_doe"
}
```

#### 📌 Response (if user found):

```json
{
  "msg": "User Found",
  "user": {
    "username": "john_doe",
    "fullName": "John Doe"
  },
  "queriedUser_Info": {
    "username": "john_doe",
    "fullName": "John Doe",
    "gender": "Male",
    "dateOfBirth": "1995-06-15",
    "country": "USA"
  }
}
```

#### 🚫 Response (if token is missing or invalid):

```json
{
  "msg": "Unauthorized, no token provided"
}
```

#### 🚫 Response (if user not found):

```json
{
  "msg": "User Not Found",
  "user": null
}
```

---

## 📌 Run the Project with Nodemon (Optional)

```sh
npm install -g nodemon
nodemon index.js
```

## 🌟 Contribution

Feel free to submit a pull request if you'd like to improve this project!

## 📜 License

This project is open-source and available under the **MIT License**.

