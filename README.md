# HRMS Lite Application

## Project Overview
HRMS Lite is a lightweight, full-stack Human Resource Management System built to streamline essential HR operations. It allows a single admin to manage employee records (Create, Read, Delete) and accurately track daily attendance statuses (Present/Absent). The application features a clean, professional, and responsive user interface with built-in state management for loading, errors, and empty data states.

## Live Links
- **Frontend Application:** - https://hrms-project-nu.vercel.app/
- **Backend API Docs:** - https://hrms-project-api.onrender.com

## Tech Stack Used
- **Frontend:** React.js (Vite), Tailwind CSS v4, Axios, React Router v6
- **Backend:** Python, FastAPI, SQLAlchemy (ORM), Pydantic
- **Database:** SQLite
- **Deployment:** Vercel (Frontend), Render (Backend)

## Steps to Run the Project Locally

### 1. Backend Setup
bash
cd hrms-backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

### 2. Frontend Setup
cd hrms-frontend
npm install
npm run dev

### Assumptions & Limitations
- **Authentication:** As per the requirements, there is no login/authentication system. The app assumes a single admin user environment.
- **Database Persistence on Render:** Because Render's free tier uses an ephemeral file system, the SQLite database will reset to empty upon server inactivity or redeployment. In a true production scenario, this would be migrated to a managed PostgreSQL instance, but SQLite was chosen for rapid assignment development.
