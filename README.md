# CourseGen - AI-Powered Course Generation Platform

![CourseGen](https://img.shields.io/badge/AI-Powered-brightgreen) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688) ![React](https://img.shields.io/badge/React-18.3.1-61DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248)

CourseGen is an intelligent course generation platform that transforms simple text prompts into comprehensive, structured courses with sections and multiple-choice questions. Powered by AI (Groq/Llama), it automates the entire course creation process while maintaining quality and coherence.

## ✨ Features

- **🤖 AI-Powered Course Generation**: Transform any topic into a structured course using advanced LLM (Llama 3.3 70B)
- **📚 Automated Section Creation**: Courses are automatically divided into logical sections with detailed content
- **❓ MCQ Generation**: Each section includes auto-generated multiple-choice questions for assessment
- **👤 User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **🎨 Modern UI**: Responsive React interface with Tailwind CSS and shadcn/ui components
- **🔍 Course Management**: View, search, paginate, and delete courses with ease
- **🌓 Theme Support**: Dark/light mode with system preference detection
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Icon library

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database with Motor (async driver)
- **Groq API** - LLM inference (Llama 3.3 70B)
- **JWT** - Authentication tokens
- **Pydantic** - Data validation

### AI/ML
- **Groq Cloud** - Ultra-fast LLM inference
- **Llama 3.3 70B Versatile** - Language model for course generation

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm/yarn
- **MongoDB** (local or Atlas)
- **Groq API Key** (sign up at [Groq Cloud](https://groq.com))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pyp
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:

```bash
pip install fastapi uvicorn motor pymongo pydantic python-dotenv groq pyjwt passlib python-multipart bcrypt
```

#### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# AI Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=coursegen
# Or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
# DB_NAME=coursegen

# JWT Authentication
ACCESS_SECRET_KEY=your_random_access_secret_key_here
REFRESH_SECRET_KEY=your_random_refresh_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration (Important for deployment!)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
# For production, add your frontend URL:
# CORS_ORIGINS=https://your-frontend-domain.com

# Media APIs (Optional - currently not in use)
YOUTUBE_API_KEY=your_youtube_api_key
PEXELS_API_KEY=your_pexels_api_key
```

#### Generate Secret Keys

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Frontend Setup

```bash
cd pyp-react
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
# From project root, with venv activated
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`
- Interactive API: `http://localhost:8000/redoc`

### Start Frontend Development Server

```bash
# From pyp-react directory
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
pyp/
├── api/                        # API route handlers
│   ├── auth_router.py         # Authentication endpoints
│   ├── user_router.py         # User management
│   ├── course_router.py       # Course CRUD operations
│   └── section_router.py      # Section operations
├── auth/                       # Authentication logic
│   ├── jwt_handler.py         # JWT token management
│   ├── password_handler.py    # Password hashing
│   └── dependencies.py        # Auth dependencies
├── models/                     # Pydantic models
│   ├── user_model.py
│   ├── course_model.py
│   ├── section_model.py
│   └── token_model.py
├── services/                   # Business logic
│   ├── auth_service.py        # Authentication service
│   ├── user_service.py        # User operations
│   ├── course_service.py      # Course generation
│   └── section_service.py     # Section generation
├── utils/                      # Utility functions
│   ├── course_inference.py    # AI course generation
│   ├── section_inference.py   # AI section generation
│   └── media_fetcher.py       # Media utilities
├── db/                         # Database configuration
│   └── connect.py             # MongoDB connection
├── pyp-react/                  # Frontend application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── router/            # Route configuration
│   │   ├── services/          # API client services
│   │   ├── store/             # Zustand state management
│   │   └── utils/             # Frontend utilities
│   └── public/                # Static assets
├── main.py                     # FastAPI application entry
├── config.py                   # Environment configuration
└── README.md                   # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Confirm password reset

### Users
- `GET /users/me` - Get current user profile

### Courses
- `GET /course/all` - Get all courses for current user
- `GET /course/{course_id}` - Get specific course details
- `POST /course/` - Generate new course from prompt
- `DELETE /course/{course_id}` - Delete course (cascade deletes sections)

### Sections
- `GET /section/{section_id}` - Get section details with MCQs

## 🎯 Usage

1. **Sign Up**: Create a new account
2. **Generate Course**: Enter a topic (e.g., "Python Programming", "Machine Learning Basics")
3. **Wait for Generation**: AI creates course structure with sections
4. **View Course**: Browse course details, sections, and descriptions
5. **Take Quiz**: Answer MCQs for each section
6. **Manage Courses**: Delete or revisit courses from your library

## 🧪 Development

### Frontend Development

```bash
cd pyp-react
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run on different port
uvicorn main:app --reload --port 8080

# View API documentation
# Open http://localhost:8000/docs in browser
```

## 🔑 Key Features Explained

### AI Course Generation
The system uses Groq's Llama 3.3 70B model to:
1. Analyze the user's topic prompt
2. Generate a comprehensive course title and description
3. Create 4-6 logically structured sections
4. Generate detailed content for each section
5. Create 3-5 MCQs per section with answers

### Authentication Flow
- JWT-based authentication with access (30 min) and refresh (7 days) tokens
- Secure password hashing with bcrypt
- Protected routes require valid access token
- Automatic token refresh on expiry

### State Management
Frontend uses Zustand for:
- User authentication state
- Course data caching
- UI preferences (theme, sidebar state)
- Filter and pagination state

## 🚀 Deployment

### Important Configuration for Production

#### 1. CORS Origins

**Critical:** Update `CORS_ORIGINS` in your `.env` file to include your production frontend URL:

```env
# Production
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# If you need both dev and production
CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

**Security Warning:** Never use `allow_origins=["*"]` in production as it allows any website to access your API.

#### 2. Database Connection

For production, use MongoDB Atlas or a managed MongoDB instance:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=coursegen_production
```

#### 3. Secret Keys

Generate strong, unique secret keys for production:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the outputs to `ACCESS_SECRET_KEY` and `REFRESH_SECRET_KEY` in your production `.env`.

#### 4. Environment Variables Checklist

Before deploying, ensure all production environment variables are set:

- [ ] `GROQ_API_KEY` - Valid API key
- [ ] `MONGO_URL` - Production database URL
- [ ] `DB_NAME` - Production database name
- [ ] `ACCESS_SECRET_KEY` - Strong random key (different from dev)
- [ ] `REFRESH_SECRET_KEY` - Strong random key (different from dev)
- [ ] `CORS_ORIGINS` - Your frontend production URL(s)

#### 5. Deployment Platforms

**Backend (FastAPI):**
- **Render**: Easy deployment with free tier
- **Railway**: Simple and fast
- **DigitalOcean App Platform**: Scalable option
- **AWS EC2** or **Google Cloud Run**: Full control

Example command for production:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Frontend (React):**
- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy static hosting
- **Cloudflare Pages**: Fast global CDN
- **AWS S3 + CloudFront**: Scalable solution

#### 6. Frontend API Configuration

Update your frontend to point to production API by setting:

```env
# In pyp-react/.env.production
VITE_API_BASE_URL=https://your-backend-api.com
```

Then modify `pyp-react/src/services/apiClient.js` to use:

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

## 🐛 Known Issues

- Media fetching (YouTube, Pexels) is currently disabled
- Image placeholders replaced with spaces in course content

## 🚧 Roadmap

- [ ] Export courses to PDF
- [ ] Share courses with other users
- [ ] Course templates
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Course ratings and reviews
- [ ] Progress tracking
- [ ] Certificate generation

## 📧 Support

For support, email support@coursegen.com or open an issue in the repository.

## 👏 Acknowledgments

- [Groq](https://groq.com) for lightning-fast LLM inference
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent web framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library

---

**Built with ❤️ using AI and modern web technologies**
