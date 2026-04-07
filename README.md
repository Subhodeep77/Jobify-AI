# 🚀 Jobify-AI  
💼 AI-Powered Job Search & Resume Intelligence Platform  

<p align="center">
  <!-- Core Badges -->
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
  <img src="https://img.shields.io/github/stars/Subhodeep77/Jobify-AI?style=social" />
  <img src="https://img.shields.io/github/forks/Subhodeep77/Jobify-AI?style=social" />
  <br/>

  <!-- Tech Stack -->
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/API-Express.js-000000?logo=express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens" />
  <br/>

  <!-- AI Stack -->
  <img src="https://img.shields.io/badge/LLM-Gemini-purple" />
  <img src="https://img.shields.io/badge/Framework-LangChain-blue" />
  <img src="https://img.shields.io/badge/VectorDB-Pinecone-orange" />
  <br/>

  <!-- Services -->
  <img src="https://img.shields.io/badge/API-SerpAPI-red" />
  <img src="https://img.shields.io/badge/Email-Nodemailer-green" />
</p>

---

## 🧠 Overview

**Jobify-AI** is a production-grade AI SaaS platform that combines:

- 💼 Intelligent job discovery  
- 📄 Resume optimization  
- 🤖 Context-aware AI assistant  

---

## 🔥 Core Idea

Traditional job portals are static.  
**Jobify-AI introduces an intent-aware system:**
User Input → AI → Intent Detection → Smart Action

---

## 💡 Key Highlights

- 🧠 Intent-based architecture (LLM + LangChain)  
- 🔍 Real-time job fetching using SerpAPI  
- 📄 Resume intelligence system  
- ⚡ Streaming AI responses  
- 🔐 Secure authentication + email workflows  

---

## ✨ Features

### 👤 User Features

- 🔐 JWT Authentication  
- 👤 Profile System  
- 📄 Resume Upload & Assistance  
- 🔍 Job Search with filters  
- 📌 Save Jobs  

---

### 🤖 AI Features

- 🧠 Intent Detection  
- 📄 Resume Suggestions  
- 🎯 Smart Job Recommendations  
- 💬 Conversational AI Assistant  

---

## 🏗 Architecture Overview
```
         ┌──────────────┐
         │   User Input │
         └──────┬───────┘
                ↓
          Gemini API
                ↓
         Intent Detection
         ↓              ↓
    Job Intent     Resume Intent
       ↓                ↓
    SerpAPI        Smart Response
       ↓           
    Job Data  

```
---
## 🛠 Tech Stack

| Layer      | Technologies                          |
|------------|--------------------------------------|
| Frontend   | React, Tailwind CSS, Axios           |
| Backend    | Node.js, Express                     |
| Database   | MongoDB                              |
| AI         | Gemini, LangChain                    |
| Vector DB  | Pinecone                             |
| APIs       | SerpAPI                              |
| Auth       | JWT                                  |
| Email      | Nodemailer                           |

---

## 📂 Project Structure
```
Jobify-AI/
│
├── client/ # Frontend (React)
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ └── utils/
│
├── backend/ # Backend (Node.js + Express)
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── services/
│ └── utils/
│
└── README.md
```
---
## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Jobify-AI.git
cd Jobify-AI
```
### 2️⃣ Install Dependencies
```
cd backend && npm install
cd ../client && npm install
```
### 3️⃣ Environment Variables

Create a .env file in the backend/ directory:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_key
SERP_API_KEY=your_serpapi_key

PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:3000
```
### 4️⃣ Run the Application
🚀 Backend
```
cd backend
npm run dev
```
💻 Frontend
```
cd client
npm run dev
```
---
## 🔌 API Endpoints
### 🔐 Auth Routes
```
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
POST	/api/auth/forgot-password	Send reset email
POST	/api/auth/reset-password	Reset password
```
### 💼 Job Routes
```
Method	Endpoint	Description
GET	/api/jobs	Get job listings
GET	/api/jobs/search	Search jobs
```
### 🤖 AI Routes
```
Method	Endpoint	Description
POST	/api/ai/chat	AI assistant interaction
```
---
## 🧠 Why This Project Stands Out
- ✅ Real-world AI system (LLM + Vector DB)
- ✅ Not CRUD — intent-driven architecture
- ✅ Streaming + context-aware responses
- ✅ Clean, scalable backend design
- ✅ Production-ready features
---
## 🤝 Contributing

Contributions are welcome.

Steps:
1. Fork the repository
2. Create a branch (feature/your-feature)
3. Commit changes
4. Push to GitHub
5. Open a Pull Request
---
## 📜 License This project is licensed under the MIT License.
---
## 👨‍💻 Author
**Subhodeep Paramanik** 
- GitHub: https://github.com/Subhodeep77  
---
## ⭐ Final Note

Jobify-AI is not just a project — it is a complete AI-powered product architecture 🚀
