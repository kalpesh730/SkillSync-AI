# SkillSync 🚀

SkillSync is an AI-driven Career Intelligence Ecosystem designed to modernize and automate the placement process in educational institutions. It brings students, placement officers, colleges, and recruiters onto a single, Multi-Tenant SaaS platform.

## Features ✨
- **Multi-Tenant Architecture:** Isolated data across different colleges.
- **AI Resume Parsing:** Extracts skills and education using Gemini AI.
- **ATS Score Generation:** Intelligent scoring to improve resume formatting.
- **Skill Gap Analysis:** Highlights missing skills for target jobs.
- **Job Matching:** Matches students with optimal opportunities.
- **Advanced Analytics:** Real-time dashboards for recruiters and placement officers.

## Tech Stack 🛠️
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **AI/ML:** Gemini AI
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Multer

## Folder Structure 📂
```text
.
├── backend/          # Express backend application
├── frontend/         # React frontend application
├── docs/             # Documentation (PRD, Architecture, RBAC)
├── .github/          # GitHub actions and templates
└── README.md         # Project documentation
```

## Installation 💻

1. Clone the repository:
   ```bash
   git clone https://github.com/kalpesh730/SkillSync-AI.git
   cd SkillSync-AI
   ```
2. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install Frontend Dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables 🔐

Create a `.env` file in the `backend` and `frontend` directories based on the provided `.env.example` templates. 

Key backend variables:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`

## Running Locally 🏃

1. Start the Backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the Frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Future Roadmap 🗺️
- AI Interview Assistant
- AI Chatbot for student queries
- Company Recommendation Engine
- Internship Portal
- Mobile Application

## Contributing 🤝
Please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for comprehensive guidelines on how to contribute to this project.

## License 📄
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
