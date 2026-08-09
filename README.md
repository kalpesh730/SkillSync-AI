# SkillSync 🚀

SkillSync is an AI-driven Career Intelligence Ecosystem designed to modernize and automate the placement process in educational institutions. It brings students, placement officers, colleges, and recruiters onto a single, Multi-Tenant SaaS platform.

## Features ✨
- **Multi-Tenant Architecture:** Fully isolated data across different colleges/organizations.
- **Role-Based Access Control (RBAC):** Strict security boundaries for Students, Recruiters, and Admins.
- **Student Profiles & Resumes:** Comprehensive portfolio building including skills, projects, and certifications.
- **Company & Job Management:** Dedicated portal for recruiters to post jobs and manage candidate pipelines.
- **Application Tracking:** Seamless application workflows from submission to final placement.
- **AI Resume Parsing:** Intelligent data extraction using Gemini AI.
- **AI ATS Scoring & Skill Gap:** Real-time feedback on job compatibility and missing skills.
- **AI Career Recommendations:** Strategic job and learning recommendations for students.
- **Advanced Analytics:** Interactive dashboards detailing placement rates, funnels, and performance.

## Tech Stack 🛠️
- **Frontend:** React (Vite), React Router, Tailwind CSS, Zustand, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **AI/ML:** Google Gemini API
- **Auth:** JWT (JSON Web Tokens) with Refresh mechanisms
- **File Upload:** Multer (Local & Cloud-ready architecture)

## Folder Structure 📂
```text
.
├── server/           # Express backend application
│   ├── config/       # Environment & Database config
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Auth, RBAC, Tenant isolation
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Definitions
│   └── services/     # Business logic & AI abstractions
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Domain-driven feature modules
│   │   ├── pages/      # Top-level routes
│   │   └── store/      # Zustand state management
├── docs/             # Documentation (PRD, Architecture)
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
   cd server
   npm install
   ```
3. Install Frontend Dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables 🔐

Create a `.env` file in the `server` and `client` directories based on the provided `.env.example` templates. 

**Backend (`server/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillsync
NODE_ENV=development
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (`client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Running Locally 🏃

1. Start the Backend server:
   ```bash
   cd server
   npm run dev
   ```
2. Start the Frontend development server:
   ```bash
   cd client
   npm run dev
   ```

## Testing 🧪
Run backend tests using standard `npm test` scripts configured in `server/package.json`. Make sure your local MongoDB instance is running.

## Contributing 🤝
Please refer to the `CONTRIBUTING.md` file for comprehensive guidelines on how to contribute to this project.

## License 📄
This project is licensed under the MIT License - see the `LICENSE` file for details.
