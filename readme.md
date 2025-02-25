# **Final Project - Triple A**

## **Project Overview**


This project is a full-stack web application built using **Node.js** and **Express.js** with **MongoDB** as the database. The application provides **user authentication**, **secure API endpoints**, and **CRUD operations** for managing posts. It aims to offer a seamless and efficient way for users to track and manage their posts. The project includes authentication using **JWT**, **data validation**, and robust **error handling** to ensure security and reliability.



## **Features**

- User authentication (Registration & Login with JWT)

- User profile management

- CRUD operations for Posts

- Secure API with token-based authentication

- Data validation and error handling

- Deployment on Renderer

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Project Setup
### Prerequisites
- Node.js installed (v16+ recommended)
- MongoDB instance (local or cloud-based e.g., MongoDB Atlas)

### Installation
```sh
# Clone the repository
git https://github.com/ai-dar/Triplera.git
cd Triplera

# Install dependencies
npm install -y

# Set up environment variables
# Create a .env file and add:
PORT=3000
MONGO_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_CODE=your_admin_code

# Start the server
node server.js
```

The API should now be running at `http://localhost:3000`

### API Endpoints

## Authentication
- `POST /register` – Register a new user
- `POST /login` – Login and receive JWT token

## User Management
- `GET /users/profile` – Get user profile
- `PUT /users/profile` – Update user profile

## Posts Management
- `POST /` – Create a post
- `GET /` – Retrieve posts
- `GET /:id` – Retrieve a specific post
- `PUT /:id` – Update a post
- `DELETE /:id` – Delete a post

## Security Measures
- Password encryption using **bcrypt**
- Token-based authentication **(JWT)**
- Protected private routes with **middleware**

## Deployment
Link to the Deployed Project