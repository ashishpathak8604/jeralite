# Jeralite — Team Task Manager

A full-stack team task management application built with React, Node.js, Express, and MongoDB.

## Project Structure

```
jeralite/
├── client/    # React frontend (Vite)
└── server/    # Node.js + Express backend
```

## Tech Stack

- **Frontend:** React (Vite), React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **Deployment:** Railway

## Getting Started

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```
