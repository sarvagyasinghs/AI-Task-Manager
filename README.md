# 🚀 AI-Powered Task Management System

A **full-stack AI-powered task management system** built with **Golang (Gin)** for the backend and **Next.js (TypeScript + Tailwind CSS)** for the frontend. This application allows users to **create, assign, track, and manage tasks** efficiently with **AI-powered task breakdowns and real-time updates**.

<img width="1386" alt="image" src="https://github.com/user-attachments/assets/84d4851b-267b-468c-8ce9-362742ee5826" />


---

## 🌟 Features

### 🛡️ Authentication & Authorization
- Secure **JWT-based authentication**.
- User **registration and login** with hashed passwords (bcrypt).
- Protected routes requiring authentication.

### 📌 Task Management
- **CRUD operations**: Create, Read, Update, and Delete tasks.
- Assign tasks to specific users.
- **Filters**: Today’s tasks, assigned tasks, completed tasks, priority-based sorting.
- **Search functionality** to quickly find tasks.

### 🤖 AI-Powered Task Suggestions
- AI-generated **task breakdowns** using **OpenAI API (GPT-3.5 Turbo)**.
- Users can input tasks and receive **step-by-step subtasks**.
- AI-generated **recommendations** to enhance productivity.

### ⚡ Real-time Updates
- **WebSockets** for instant updates across multiple users.
- New tasks, updates, and deletions are reflected **without page refresh**.

### 📊 Productivity Dashboard
- **Task completion progress indicator**.
- **Real-time statistics** on completed and pending tasks.

### 🎉 User Experience Enhancements
- **Motivational affirmations** when completing tasks.
- **Minimal, elegant UI** built using **ShadCN UI components**.

### ☁️ Deployment
- **Backend**: Hosted on **Fly.io / Render**.
- **Frontend**: Deployed on **Vercel**.
- **Database**: PostgreSQL running on **Supabase**.

---

## 🛠️ Tech Stack

### Backend: **Golang (Gin)**
- **Gin framework** for fast and efficient REST API.
- **GORM (ORM for Golang)** with **PostgreSQL** for database management.
- **JWT authentication** for secure user sessions.
- **WebSockets** for real-time updates.
- **OpenAI API** integration for AI-generated task suggestions.
  
<img width="805" alt="image" src="https://github.com/user-attachments/assets/7792214b-5f61-47ad-b0c3-827de1191558" />


### Frontend: **Next.js (TypeScript + Tailwind CSS)**
- **Next.js App Router** for optimized client-server rendering.
- **Tailwind CSS** for a clean, responsive, and modern UI.
- **ShadCN UI components** for professional and minimalistic design.
- **Axios** for seamless API communication.
- **LocalStorage** for session management.

### Database: **PostgreSQL**
- Hosted on **Supabase** (or any PostgreSQL instance).
- **GORM ORM** for seamless database interactions.

### Cloud & Deployment
- **Backend**: Deployed on **Fly.io / Render**.
- **Frontend**: Hosted on **Vercel**.

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/sarvagyasinghs/AI-Task-Manager.git
cd AI-Task-Manager
```

🔥 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/api/register	Register a new user
POST	/api/login	Login and receive JWT
Task Routes
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create a new task
PUT	/api/tasks/:id	Update task details
DELETE	/api/tasks/:id	Delete a task
AI Routes
Method	Endpoint	Description
GET	/api/ai/suggestions	Get generic AI task advice
GET	/api/ai/suggestions?task=example	AI-generated breakdown
WebSockets
Endpoint	Description
/api/ws	Real-time updates for task changes
