# 🩸 Life-Saving Blood Bank

![Life-Saving Blood Bank Hero](./hero.png)

A comprehensive, real-time web application designed to bridge the gap between blood donors and those in need. This platform streamlines donor registration, hospital management, and emergency blood requests.

---

## 🚀 Technical Stack

- **Frontend**: [React.js](https://reactjs.org/) (Single Page Application)
- **Backend**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: Vanilla CSS & Bootstrap
- **Hosting**: 
  - **Frontend**: [Netlify](https://www.netlify.com/)
  - **Backend**: [Live on Render](https://hemo-n2ss.onrender.com)

---

## ✨ Key Features

- **Donor Management**: Register as a donor and manage availability.
- **Hospital Dashboard**: Manage blood inventory and requests.
- **Emergency Requests**: Real-time notification system for urgent blood needs.
- **Secure Authentication**: JWT-based login for users and administrators.
- **Responsive Interface**: Seamless experience across mobile and desktop.

---

## 📂 Project Structure

```text
root/
├── .gitignore
├── README.md
├── hero.png             # Project banner
├── backend/             # Node.js + Express API
│   ├── config/          # Database connection (Supabase)
│   ├── controllers/     # API request handlers
│   ├── routes/          # Express route definitions
│   ├── server.js        # Backend entry point
│   └── package.json     # Backend dependencies
└── frontend/            # React Client
    ├── public/          # Static assets & Netlify redirects
    ├── src/             # React components & logic
    │   ├── Admin/       # Administrative management views
    │   ├── Main/        # Main donor views
    │   └── utils/       # API services and helpers
    └── package.json     # Frontend dependencies
```

---

## 🛠️ Local Development

### 1. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure your API keys in a `.env` file (see `.env.example`).
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm start`

---

## 🌐 Deployment

### Backend (Render)
1. Set the **Root Directory** to `backend`.
2. Connect your Supabase credentials in the environment variables.

### Frontend (Netlify)
1. Set the **Base directory** to `frontend`.
2. Set the **Build command** to `npm run build`.
3. Set the **Publish directory** to `frontend/build`.
4. Ensure `REACT_APP_API_URL` is set to your Render backend URL.

---

## 📄 License
This project is for educational and humanitarian purposes.

---

*Made with ❤️ to save lives.*
