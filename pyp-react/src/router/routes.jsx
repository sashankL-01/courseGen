import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../app/AppLayout.jsx'
import Landing from '../pages/Landing.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import AppHome from '../pages/AppHome.jsx'
import Courses from '../pages/Courses.jsx'
import CourseDetails from '../pages/CourseDetails.jsx'
import SectionDetails from '../pages/SectionDetails.jsx'
import Help from '../pages/Help.jsx'
import Profile from '../pages/Profile.jsx'
import Settings from '../pages/Settings.jsx'
import NotFound from '../pages/NotFound.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
        errorElement: <NotFound />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <AppHome /> },
            { path: 'courses', element: <Courses /> },
            { path: 'courses/:courseId', element: <CourseDetails /> },
            { path: 'courses/:courseId/sections/:sectionId', element: <SectionDetails /> },
            { path: 'help', element: <Help /> },
            { path: 'profile', element: <Profile /> },
            { path: 'settings', element: <Settings /> },
            { path: '*', element: <NotFound /> },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
])

export default router
