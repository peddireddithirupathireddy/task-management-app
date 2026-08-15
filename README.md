# Task Management Application

A full-stack Task Management Application developed using Node.js, Express, SQLite, HTML, CSS and JavaScript.

## Features

- User Registration
- User Login
- JWT Authentication
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Task Status
- Due Dates
- Responsive Design
- REST API
- SQLite Database

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQLite

### Authentication
- JWT
- bcrypt

## Project Structure

```text
task-management-application/

├── server.js
├── package.json
├── .gitignore
├── README.md
│
├── database/
│   └── database.js
│
├── middleware/
│   └── auth.js
│
├── routes/
│   ├── auth.js
│   └── tasks.js
│
└── public/
    ├── index.html
    ├── style.css
    └── app.js
