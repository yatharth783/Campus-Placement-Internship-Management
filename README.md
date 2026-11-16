# 🎓 CampusConnect — College Placement & Internship Management Platform

CampusConnect is a university recruitment and internship management platform built with a modern full-stack architecture and an integrated Python FastAPI Machine Learning microservice.

Designed for three distinct university roles:
1. **Students** — Academic profile management, PDF resume upload with automated skill extraction, one-click eligibility verification, TF-IDF cosine similarity job recommendations, skill gap analysis, and real-time application status tracking.
2. **Corporate Recruiters** — Company profile branding, job/internship posting with fine-grained eligibility rules (CGPA, branch, batch, skills), candidate applicant review with direct resume access, and application pipeline management (Applied, Under Review, Shortlisted, Selected, Rejected).
3. **Placement Officers / Administrators** — Comprehensive placement analytics dashboards, interactive Recharts visualizations (pipeline breakdown, branch distribution, top employers), recruiter company verification and moderation, and placement progress reporting.

---

## 🏗️ System Architecture

```
CampusConnect/
│
├── client/                     # Frontend (React.js + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Common badges, modals, stat cards, navbar, sidebar
│   │   ├── context/            # AuthContext, NotificationContext (toast system)
│   │   ├── pages/
│   │   │   ├── student/        # StudentDashboard, StudentProfile, StudentApplications, MLCareerAssistant
│   │   │   ├── recruiter/      # RecruiterDashboard, ManageJobs, PostJob, ReviewApplicants, RecruiterProfile
│   │   │   ├── admin/          # AdminDashboard, ManageUsers, ManageJobs, PlacementReports
│   │   │   ├── Home.jsx        # Landing page with placement metrics and role cards
│   │   │   ├── Login.jsx       # Auth form with 1-click test credential pills
│   │   │   ├── RegisterStudent.jsx
│   │   │   ├── RegisterRecruiter.jsx
│   │   │   ├── BrowseJobs.jsx  # Job browsing, keyword filters, eligibility modals, 1-click apply
│   │   │   ├── JobDetail.jsx   # Position specifications & recruiter criteria
│   │   │   └── About.jsx       # Architecture & ML engine documentation
│   │   ├── services/api.js     # Axios client with JWT interceptor & baseURL handling
│   │   ├── app.jsx             # React Router v6 with Role-Based Route Guards
│   │   └── main.jsx
│   ├── vercel.json             # Vercel SPA client-side rewrite configuration
│   ├── vite.config.js          # Vite config with /api proxy to Node.js backend
│   └── .env.example
│
├── server/                     # Backend REST API (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/db.js        # MongoDB Atlas connector with zero-config embedded fallback
│   │   ├── controllers/        # auth, student, recruiter, job, application, admin, ml
│   │   ├── middleware/         # authMiddleware (JWT role guards), uploadMiddleware (multer PDF validation), errorMiddleware
│   │   ├── models/             # User, Company, Job, Application Mongoose schemas
│   │   ├── routes/             # Modular Express routers
│   │   ├── services/mlService.js # ML service HTTP client with resilient deterministic fallback
│   │   ├── utils/seeder.js     # Realistic demo dataset seeder
│   │   ├── app.js              # Express app setup, CORS, static uploads
│   │   └── server.js           # Server entrypoint with port handling
│   ├── tests/
│   │   ├── api.test.js         # Comprehensive 8/8 end-to-end backend test suite
│   │   └── mlIntegration.test.js # Backend <-> FastAPI microservice contract verification
│   └── .env.example
│
├── ml-service/                 # ML Microservice (Python + FastAPI + scikit-learn)
│   ├── app/
│   │   ├── models/schemas.py   # Pydantic request & response schemas
│   │   ├── services/
│   │   │   ├── job_matcher.py  # TF-IDF Vectorizer & Cosine Similarity ranking
│   │   │   ├── resume_parser.py# PyPDF document text extraction & rule-based feedback
│   │   │   ├── skill_dictionary.py # Configurable dictionary of 100+ industry skills
│   │   │   ├── skill_gap.py    # Deterministic skill overlap and gap detector
│   │   │   └── text_processor.py # Text normalization and regex tokenization
│   │   ├── config.py           # PORT and environment handling (Render & local)
│   │   └── main.py             # FastAPI application with CORS and 5 career endpoints
│   ├── tests/
│   │   └── test_ml.py          # ML service unit & integration test suite
│   ├── requirements.txt        # Production Python dependencies including uvicorn & gunicorn
│   └── run.py                  # ASGI server launcher
│
├── .gitignore                  # Git ignore rules for node_modules, venvs, dist, and .env files
└── README.md                   # Full documentation
```

---

## ⚡ Quick Start: Local Development (Windows PowerShell)

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: 3.10+ or 3.12+
- **MongoDB**: (Optional) MongoDB Atlas or local MongoDB. If unset, an embedded in-memory MongoDB instance automatically initializes for zero-config local testing.

---

### Step 1: Clone and Inspect
```powershell
cd D:\CampusConnect
```

---

### Step 2: Configure Environment Variables

Create `.env` files in each service directory using the provided `.env.example` templates:

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=campusconnect_super_secret_jwt_key_2026
JWT_EXPIRE=7d
ML_SERVICE_URL=http://127.0.0.1:8000
# Optional: MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/campusconnect
# If MONGODB_URI is left blank, zero-config embedded MongoDB will be used automatically.
```

**Client (`client/.env`):**
```env
VITE_API_URL=/api
```

**ML Service (`ml-service/.env`):**
```env
ML_PORT=8000
ML_HOST=0.0.0.0
DEBUG=true
```

---

### Step 3: Install Dependencies

Open a PowerShell terminal for each service:

**Terminal 1 — Node.js Backend:**
```powershell
cd D:\CampusConnect\server
npm install
```

**Terminal 2 — React Client:**
```powershell
cd D:\CampusConnect\client
npm install
```

**Terminal 3 — Python ML Service:**
```powershell
cd D:\CampusConnect\ml-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

### Step 4: Run Verification Tests

**Backend Comprehensive Test Suite (8/8 tests):**
```powershell
cd D:\CampusConnect\server
npm test
```
*Tests health probe, user database seed, public job listings, student JWT auth, protected profile, 403 Forbidden role guard, admin stats, and recruiter jobs.*

**ML Service Direct Unit Tests:**
```powershell
cd D:\CampusConnect\ml-service
python tests\test_ml.py
```
*Tests skill extraction, TF-IDF cosine similarity job ranking, skill gap analysis, and resume feedback.*

**Full Integration Test (Backend <-> ML Microservice):**
```powershell
cd D:\CampusConnect\server
node tests\mlIntegration.test.js
```

---

### Step 5: Start All Three Services Locally

**1. Launch the ML Microservice (Port 8000):**
```powershell
cd D:\CampusConnect\ml-service
python run.py
# Running on http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)
```

**2. Launch the Backend Server (Port 5000):**
```powershell
cd D:\CampusConnect\server
npm run dev
# Running on http://localhost:5000/api
```

**3. Launch the React Client (Port 3000):**
```powershell
cd D:\CampusConnect\client
npm run dev
# Running on http://localhost:3000
```

Open your browser at `http://localhost:3000`.

---

## 🔑 Demo Accounts & Pre-Seeded Data

The database comes pre-seeded with realistic demonstration data. On the login screen, 1-click demo buttons automatically populate these credentials:

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Placement Director (Admin)** | Dr. Ramesh Sharma | `admin@campusconnect.edu` | `Admin@123` | Full access to directorate analytics, user verification, job moderation |
| **Recruiter (Google India)** | Pooja Agarwal | `recruiter.google@campusconnect.edu` | `Recruiter@123` | Active drives: Full Stack Engineer (MERN), AI/ML Research Intern |
| **Recruiter (Microsoft IDC)** | Vikram Malhotra | `recruiter.microsoft@campusconnect.edu` | `Recruiter@123` | Active drives: Cloud Software Engineer, Frontend UI/UX Developer |
| **Recruiter (Infosys Limited)** | Suresh Menon | `recruiter.infosys@campusconnect.edu` | `Recruiter@123` | Active drive: Specialist Programmer |
| **Student** | Yash Vardhan | `yash.student@campusconnect.edu` | `Student@123` | Computer Science, 8.85 CGPA, React & Node skills, uploaded resume |
| **Student** | Priya Sharma | `priya.student@campusconnect.edu` | `Student@123` | Computer Science, 9.20 CGPA, ML & Python skills, Selected at Google |
| **Student** | Rohit Verma | `rohit.student@campusconnect.edu` | `Student@123` | Electronics & Comm, 7.60 CGPA, C++ & Embedded systems skills |
| **Student** | Ananya Gupta | `ananya.student@campusconnect.edu` | `Student@123` | Information Tech, 8.40 CGPA, Java & Spring Boot skills |

---

## 🧠 ML-Powered Career Assistant Architecture

The ML service is built with FastAPI, PyPDF, and scikit-learn. It operates deterministically without external third-party API keys or paid OpenAI dependencies:

### 1. Document Extraction (`/extract-resume`)
- Validates PDF MIME types and maximum file sizes (5MB).
- Extracts clean text from PDF documents using `pypdf`.
- Tokenizes and cleans text, stripping unwanted symbols and excessive whitespace.
- Identifies technical skills against a configurable dictionary of 100+ technologies.

### 2. Smart Job Recommendations (`/recommend-jobs`)
- Constructs combined text vectors for the student (skills, bio, experience, resume text) and all candidate jobs (title, description, required skills).
- Computes `TfidfVectorizer(stop_words='english', max_features=1500)`.
- Calculates pairwise Cosine Similarity:
  $$\text{Cosine Similarity} = \frac{A \cdot B}{\|A\| \|B\|}$$
- Returns jobs ranked by similarity percentage (0% to 100%).
- *Important note*: Scores are clearly labeled as text similarity scores and do not imply guaranteed selection or job offers.

### 3. Skill Gap Analysis (`/skill-gap`)
- Evaluates student skills against required job skills.
- Produces two distinct buckets:
  - `matching_skills`: Verified overlapping competencies.
  - `skills_not_found_in_profile`: High-priority learning gaps.
- Computes overall skill coverage percentage:
  $$\text{Coverage} = \frac{|\text{Matching}|}{|\text{Required}|} \times 100$$
- Provides targeted learning topics and study suggestions.

### 4. Resume Quality & Feedback (`/resume-feedback`)
- Evaluates resume text density and word count categories (e.g. Brief, Concise, Overly Verbose).
- Identifies presence of strong technical action verbs (`Engineered`, `Architected`, `Optimized`, `Deployed`).
- Cross-references missing keywords against the chosen target job opening.
- Returns actionable rule-based constructive suggestions.

---

## 🚀 Cloud Deployment Instructions

### 1. MongoDB Atlas Setup
1. Sign in to [cloud.mongodb.com](https://cloud.mongodb.com/) and create a free Shared Cluster (M0).
2. Under **Database Access**, create a user (e.g. `campusconnect_user`) with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow connections from anywhere) so Render can reach the cluster.
4. Copy the connection string:
   `mongodb+srv://campusconnect_user:<password>@cluster0.abcde.mongodb.net/campusconnect?retryWrites=true&w=majority`

### 2. Push Codebase to GitHub
```powershell
cd D:\CampusConnect
git init
git add .
git commit -m "feat: complete CampusConnect placement platform with ML service"
git branch -M main
git remote add origin https://github.com/<your-username>/CampusConnect.git
git push -u origin main
```

### 3. Deploy ML Service on Render
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository `CampusConnect`.
3. Configure the service:
   - **Name**: `campusconnect-ml`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `PORT`: `10000`
   - `DEBUG`: `false`
5. Click **Create Web Service**. Note the deployed URL (e.g., `https://campusconnect-ml.onrender.com`).

### 4. Deploy Backend Server on Render
1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository `CampusConnect`.
3. Configure the service:
   - **Name**: `campusconnect-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random 64-character secret string>`
   - `JWT_EXPIRE`: `7d`
   - `ML_SERVICE_URL`: `https://campusconnect-ml.onrender.com` (Your Render ML Service URL)
5. Click **Create Web Service**. Note the deployed URL (e.g., `https://campusconnect-api.onrender.com`).

### 5. Deploy Frontend on Vercel
1. Sign in to [vercel.com](https://vercel.com/) and click **Add New...** -> **Project**.
2. Select your `CampusConnect` repository.
3. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `client`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://campusconnect-api.onrender.com/api` (Your deployed Render backend URL)
5. The included `client/vercel.json` ensures all deep SPA routes (`/student/dashboard`, `/jobs`, `/recruiter/manage-jobs`) rewrite to `/index.html` without 404 errors.
6. Click **Deploy**. Your placement portal is live!

---

## 🔒 Security & Best Practices Implemented

- **Password Hashing**: Salted bcrypt hashing with 10 rounds; plaintext passwords are never persisted.
- **JWT Authorization**: Bearer token authorization verified via backend middleware on all private endpoints.
- **Strict Role-Based Access Control**:
  - `authorizeRole('admin')` protects all administrative statistics and user moderation routes.
  - `authorizeRole('recruiter')` enforces that recruiters can only manage their own job openings and applicants.
  - `authorizeRole('student')` ensures students cannot alter application review statuses.
  - Public registration is strictly restricted to Student and Recruiter accounts. Admin accounts cannot be created publicly.
- **File Upload Safeguards**: Multer filters validate PDF MIME types (`application/pdf`) and enforce a 5MB maximum file size.
- **Environment Isolation**: All secrets, JWT tokens, and connection strings are managed through `.env` variables. Sample `.env.example` templates are provided with no real credentials committed.

---

## 📄 License
This project is developed for academic university campus placement and internship automation.
