import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useStore from '../store/index.js'
import { LoadingState } from './StateBlocks.jsx'

function ProtectedRoute({ children }) {
    const location = useLocation()
    const auth = useStore((state) => state.auth)
    const isAuthenticated = useStore((state) => state.isAuthenticated)
    const fetchUser = useStore((state) => state.fetchUser)
    const userStatus = useStore((state) => state.user.status)

    // Call isAuthenticated as a function
    const authenticated = isAuthenticated()

    useEffect(() => {
        // Re-fetch user data on mount if authenticated but user not loaded
        if (authenticated && !auth.user && userStatus !== 'loading') {
            fetchUser()
        }
    }, [authenticated, auth.user, userStatus, fetchUser])

    // Loading state while checking authentication
    if (authenticated && !auth.user && userStatus === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingState
                    label="Loading"
                    description="Verifying your session..."
                />
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
