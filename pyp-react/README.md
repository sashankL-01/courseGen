# CourseGen Frontend

React-based frontend for the CourseGen AI-powered course generation platform.

## 🛠️ Tech Stack

- **React 18.3** with Vite
- **React Router v6** for routing
- **Zustand** for state management
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── app/
│   └── AppLayout.jsx         # Main authenticated layout with sidebar
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   ├── StateBlocks.jsx       # Loading, Error, Empty states
│   └── Footer.jsx            # Site footer
├── pages/
│   ├── Landing.jsx           # Public landing page
│   ├── Login.jsx             # Authentication
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── AppHome.jsx           # Dashboard/Home
│   ├── Courses.jsx           # Course listing with creation
│   ├── CourseDetails.jsx     # Individual course view
│   ├── SectionDetails.jsx    # Section with MCQs
│   ├── Profile.jsx
│   ├── Settings.jsx
│   ├── Help.jsx
│   └── NotFound.jsx
├── router/
│   └── routes.jsx            # Route configuration
├── services/
│   ├── apiClient.js          # Axios instance
│   ├── auth.js               # Auth API calls
│   ├── courses.js            # Course API calls
│   └── sections.js           # Section API calls
├── store/
│   ├── index.js              # Zustand store
│   └── slices/
│       ├── authSlice.js      # Authentication state
│       ├── courseSlice.js    # Course data
│       ├── sectionSlice.js   # Section data
│       ├── userSlice.js      # User profile
│       └── uiSlice.js        # UI preferences
└── utils/
    └── utils.js              # Utility functions
```

## 🎨 Key Features

- **Protected Routes**: Authentication-based route protection
- **State Management**: Centralized Zustand store for auth, courses, and UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Dark/light mode with system preference detection
- **Error Handling**: Comprehensive error boundaries and states
- **Optimistic Updates**: Fast UI updates with background sync

## 🔧 Configuration

### Environment Variables

Create `.env` file (if needed):

```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Client

The API client (`services/apiClient.js`) automatically:
- Includes authentication tokens
- Handles token refresh
- Manages CORS
- Provides error handling

## 📱 Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/signup` - New user registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset confirmation

### Protected Routes (requires auth)
- `/app` - Dashboard/Home
- `/app/courses` - Course library
- `/app/courses/:id` - Course details
- `/app/sections/:id` - Section with MCQs
- `/app/profile` - User profile
- `/app/settings` - User settings
- `/app/help` - Help center

## 🧩 Component Guidelines

### Using shadcn/ui Components

Components are located in `src/components/ui/`:

```jsx
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Dialog } from '../components/ui/dialog.jsx'
```

### State Management

Access store with Zustand hooks:

```jsx
import useStore from '../store/index.js'

function MyComponent() {
  const user = useStore(state => state.auth.user)
  const fetchCourses = useStore(state => state.fetchCourses)
  
  // Component logic
}
```

## 📦 Build Output

Production builds are optimized and output to `dist/`:

```bash
npm run build
# Output directory: dist/
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 5174
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Additional Documentation

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

Part of the **CourseGen** project. See main README for full setup instructions.
