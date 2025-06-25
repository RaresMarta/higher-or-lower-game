# 🎲 Higher or Lower Game

Welcome to the **Higher or Lower Game**! This is a single-player web game where you guess if the next number will be higher or lower. Built with **FastAPI** (Python) for the backend and **React + TypeScript + Bulma** for the frontend.

---

## ✨ Features
- User registration/login
- Start a new game and guess higher or lower
- Tracks your best streak and total games
- View and clear your statistics
- Cute, clean Bulma-powered UI
- Logging on both client and server

---

## 🚀 Getting Started

### Requirements
- Python 3.8+
- Node.js & npm

### 1. Clone the repository
```sh
git clone https://github.com/RaresMarta/higher-or-lower-game
cd YOUR_REPO
```

### 2. Backend Setup (FastAPI)
```sh
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt  # or pip install fastapi uvicorn sqlalchemy
uvicorn main:app --reload
```

### 3. Frontend Setup (React + Vite)
```sh
cd ../frontend
npm install
npm run dev
```

- Backend runs on: `http://localhost:8000`
- Frontend runs on: `http://localhost:5173`

---

## 🕹️ How to Play
1. Enter your username to login or register.
2. Start a new game.
3. Guess if the next number will be higher or lower!
4. Try to beat your best streak.
5. View or clear your statistics anytime.
6. Logout to switch users.

---

## 📸 Screenshots
> _Add your own screenshots here!_

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
