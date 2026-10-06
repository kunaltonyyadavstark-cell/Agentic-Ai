# 🚀 AgentLogic Academy

> **AI-Powered Programming Learning Platform** - Your personal coding tutor powered by Google Gemini 2.0

An AI-powered coding practice platform for generating, managing, and evaluating programming exercises with structured learning content and automated exercise generation.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**AgentLogic Academy** is a full-stack AI-powered programming learning platform where **Gemini 2.0 acts as your personal tutor**. It's not just an exercise platform - it's a complete learning ecosystem with real-time AI assistance, interactive code execution, gamification, and advanced analytics.

### Why AgentLogic Academy?

- 🤖 **AI-Powered Learning**: Real-time code analysis and personalized guidance from Gemini 2.0
- 💻 **Interactive Workspace**: Monaco Editor with syntax highlighting for 10+ languages
- 🧪 **Real Code Execution**: Execute Python and JavaScript code with instant feedback
- 🎮 **Gamification**: XP system, achievements, streaks, and leaderboards
- 📊 **Advanced Analytics**: Track your progress with beautiful visualizations
- 🔍 **Smart Search**: Advanced filtering by language, difficulty, and category
- 💡 **Hints System**: Progressive hints with XP penalties for balanced learning

---

## ✨ Features

### 🎓 Learning Features

- **30+ Diverse Exercises** across 6 categories (Arrays, Strings, Loops, Data Structures, Algorithms, Logic & Math)
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, and more
- **AI Assistant with 5 Tabs**:
  - 📝 **Explanation**: Exercise breakdown with roadmap
  - 📊 **Flowchart**: Visual algorithm representation with Mermaid
  - 💬 **Chat**: Contextual Q&A with Gemini
  - ✅ **Tests**: Real-time test execution
  - 💡 **Hints**: Progressive learning aids
- **Code Templates**: 25+ ready-to-use snippets
- **Real-time Code Analysis**: Instant feedback on your approach

### 🎮 Gamification

- **XP & Level System**: Earn experience points by solving exercises
- **Achievements & Badges**: Unlock special milestones
- **Streak System**: Maintain daily consistency
- **Goals**: Daily and weekly XP targets
- **Celebrations**: Epic confetti animations on completion

### 📊 Analytics Dashboard

- **Activity Heatmap**: GitHub-style activity calendar (90 days)
- **Language Statistics**: Track your progress per language
- **Difficulty Distribution**: Visualize your skill growth
- **Progress Charts**: Weekly XP trends

### 🔍 Search & Filters

- **Smart Search**: Find exercises by title, description, or keywords
- **Category Filters**: 6 visual categories with icons
- **Multi-Criteria Filtering**: Combine language, difficulty, and category
- **Quick Filters**: Unsolved, Recent, Popular

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express 5.1
- **Language**: TypeScript 5.0
- **Database**: MongoDB 7.0 + Mongoose
- **Authentication**: JWT + bcrypt
- **AI**: Google Gemini 2.0 Flash
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Vitest
- **Documentation**: Swagger UI

### Frontend

- **Framework**: React 18
- **Language**: TypeScript 5.0
- **Build Tool**: Vite 7.1
- **State Management**: 
  - Zustand (auth state)
  - TanStack Query (server state)
- **UI Library**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS 3.3
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Router**: React Router v6
- **Forms**: react-hook-form + Zod
- **Notifications**: Sonner

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB** 7.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Git** ([Download](https://git-scm.com/))
- **Google Gemini API Key** ([Get one](https://aistudio.google.com/app/apikey))

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Bitxogm/New-Logic-Agent.git
cd New-Logic-Agent
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Set up MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Or use MongoDB Compass
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

---

## 🔐 Environment Variables

### Backend `.env`

Create `backend/.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agentlogic

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`

Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `backend/.env`

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 3 - Seed Database (Optional):**
```bash
cd backend
npm run seed
```
This will populate the database with 30 sample exercises.

### Production Mode

**Build Backend:**
```bash
cd backend
npm run build
npm start
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📁 Project Structure
```
AgentLogic-Academy/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Swagger, Logger config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (Gemini, etc.)
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions
│   ├── scripts/             # Seed scripts
│   └── tests/               # Unit and integration tests
│
└── frontend/
    └── src/
        ├── components/      # React components
        │   ├── analytics/   # Analytics visualizations
        │   ├── editor/      # Monaco editor wrapper
        │   ├── exercises/   # Exercise-related components
        │   ├── gamification/ # XP, achievements, stats
        │   ├── layout/      # Header, Footer, Layout
        │   ├── ui/          # shadcn/ui components
        │   └── workspace/   # Template selector
        ├── data/            # Static data (templates)
        ├── hooks/           # Custom React hooks
        ├── pages/           # Page components
        ├── services/        # API services
        ├── store/           # Zustand stores
        └── types/           # TypeScript types
```

---

## 📚 API Documentation

Once the backend is running, visit:

**Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Exercises
- `GET /api/exercises` - List exercises (with filters)
- `GET /api/exercises/:id` - Get exercise by ID
- `POST /api/exercises` - Create exercise
- `PATCH /api/exercises/:id` - Update exercise
- `DELETE /api/exercises/:id` - Delete exercise

#### AI Features
- `POST /api/ai/generate-solution` - Generate solution
- `POST /api/ai/analyze-code` - Analyze code
- `POST /api/ai/explain-concept` - Explain concept
- `POST /api/ai/analyze-exercise` - Analyze exercise
- `POST /api/ai/analyze-progress` - Analyze progress

#### Gamification
- `GET /api/gamification/stats/:userId` - Get user stats
- `POST /api/gamification/complete-exercise` - Complete exercise
- `POST /api/gamification/use-hint` - Use hint (XP penalty)
- `GET /api/gamification/progress/:userId` - Get progress

#### Analytics
- `GET /api/analytics/heatmap/:userId` - Activity heatmap
- `GET /api/analytics/language-stats/:userId` - Language statistics
- `GET /api/analytics/difficulty-stats/:userId` - Difficulty distribution

#### Test Execution
- `POST /api/test-execution/run` - Execute code tests

---

## 📜 Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm start            # Start production server
npm test             # Run tests with Vitest
npm run seed         # Seed database with sample exercises
npm run type-check   # Check TypeScript types
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript types
npm run lint         # Lint code with ESLint
```

---

## 🎓 Usage Guide

### For Students

1. **Register/Login**: Create an account or sign in
2. **Browse Exercises**: Explore 30+ exercises by category
3. **Start Workspace**: Click "Start Working" on any exercise
4. **Code & Learn**: Write code with AI assistance
5. **Run Tests**: Execute tests to validate your solution
6. **Track Progress**: View your analytics and achievements

### For Instructors

1. **Create Exercises**: Use the "Create Exercise" page
2. **Add Test Cases**: Define input/output test cases
3. **Set Difficulty**: Easy, Medium, or Hard
4. **Add Hints**: Progressive hints for students
5. **Provide Solution**: Reference implementation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Known Issues

- Integration tests need updating (auth changes)
- E2E tests setup pending
- Some exercises may need additional test cases

---

## 🔮 Roadmap

- [ ] Mobile responsive optimization
- [ ] Social features (solution sharing, comments)
- [ ] More programming languages
- [ ] Live coding sessions
- [ ] Leaderboards and competitions
- [ ] Custom user themes
- [ ] Code collaboration features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Bitxogm**

- GitHub: [@Bitxogm](https://github.com/Bitxogm)
- Repository: [New-Logic-Agent](https://github.com/Bitxogm/New-Logic-Agent)

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the amazing AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the VS Code experience
- [Recharts](https://recharts.org/) for data visualization
- All contributors and users of this project

---

## 📸 Screenshots

### Workspace
![Workspace](docs/screenshots/workspace.png)
*Interactive coding workspace with AI assistant*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Track your progress and achievements*

### Analytics
![Analytics](docs/screenshots/analytics.png)
*Detailed performance analytics*

---

## 💡 Tips & Tricks

### For Best Learning Experience

1. **Start with Easy**: Build confidence with easy exercises first
2. **Use Hints Wisely**: Try solving without hints for maximum XP
3. **Experiment**: The AI assistant can explain alternative approaches
4. **Track Progress**: Check analytics to identify areas for improvement
5. **Maintain Streak**: Code daily to build consistency

### Performance Tips

- Use code templates for faster development
- Check the flowchart tab to understand the algorithm
- Run tests frequently to catch errors early
- Save snapshots of your work regularly

---

**⭐ If you find this project useful, please consider giving it a star on GitHub! ⭐**

Made with ❤️ and lots of ☕
