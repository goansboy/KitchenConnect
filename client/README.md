
# 🍽️ KitchenConnect

**KitchenConnect** is a full-stack social platform for cooking lovers. Users can share recipes, schedule meals, build shopping lists, and follow other cooks. Built with **React**, **Node.js**, **Express**, **Firebase**, and **MongoDB Atlas**.

---

## 🚀 Features

- User authentication with Firebase
- Recipe sharing and scheduling
- Shopping list management
- Social features: follow users and view their recipes
- Clean and responsive UI

---

## 🧰 Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Authentication: Firebase
- Database: MongoDB Atlas (Cloud)
- Styling: Plain CSS/JS (no Tailwind in final version)

---

## ⚙️ Setup Instructions

### ✅ Requirements

- Node.js (v16+ recommended)
- npm
- MongoDB Atlas account
- Firebase project

---

### 📦 1. Clone the Repository

```bash
git clone https://github.com/goansboy/kitchenconnect.git
cd kitchenconnect
```

---

### 🧪 2. Environment Variables

#### In `/client/.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

#### In `/server/.env`:

```
MONGO_URI= your_mongodb_connection_string
PORT=5000
```

> Replace `your_mongodb_connection_string` with your MongoDB Atlas URI.

---

### 🔥 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Email/Password Authentication**
4. In `/client/src/firebase.js`, paste your Firebase config:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  appId: "...",
  // etc.
};
```

---

### 📦 4. Install Dependencies

In `/client`:

```bash
cd client
npm install
```

In `/server`:

```bash
cd server
npm install
```

---

### ▶️ 5. Run the Application

**Start Backend:**

```bash
cd server
node server.js
```

**Start Frontend:**

```bash
cd client
npm start
```

App will run at: `http://localhost:3000`

---


## 📌 Notes

- Backend is hosted locally (use MongoDB Atlas in the cloud).
- Firebase handles authentication securely.
- Application is structured for easy deployment or Dockerization if needed.

---

