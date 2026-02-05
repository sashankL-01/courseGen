import { login as loginRequest, refresh as refreshRequest } from '../../services/auth.js'

const authInitialState = {
    token: null,
    refreshToken: null,
    user: null,
    status: 'idle',
    error: null,
}

const createAuthSlice = (set, get) => ({
    auth: { ...authInitialState },
    // Function to check authentication status
    isAuthenticated: () => {
        const state = get()
        return !!(state?.auth?.token && state?.auth?.user)
    },
    setAuth: (payload) =>
        set(
            (state) => ({
                auth: { ...state.auth, ...payload },
            }),
            false,
            'auth/set'
        ),
    clearAuth: () =>
        set(
            {
                auth: { ...authInitialState },
            },
            false,
            'auth/clear'
        ),
    setAuthStatus: (status) =>
        set(
            (state) => ({
                auth: { ...state.auth, status },
            }),
            false,
            'auth/status'
        ),
    setAuthError: (error) =>
        set(
            (state) => ({
                auth: { ...state.auth, error },
            }),
            false,
            'auth/error'
        ),
    login: async (credentials) => {
        set(
            (state) => ({
                auth: { ...state.auth, status: 'loading', error: null },
            }),
            false,
            'auth/login'
        )

        try {
            const response = await loginRequest(credentials)
            set(
                (state) => ({
                    auth: {
                        ...state.auth,
                        token: response?.access_token ?? null,
                        refreshToken: response?.refresh_token ?? null,
                        user: { id: response?.user_id },
                        status: 'authenticated',
                        error: null,
                    },
                }),
                false,
                'auth/login-success'
            )
            return response
        } catch (error) {
            set(
                (state) => ({
                    auth: {
                        ...state.auth,
                        status: 'error',
                        error: error?.message || 'Login failed',
                    },
                }),
                false,
                'auth/login-error'
            )
            return null
        }
    },
    refresh: async () => {
        const { auth } = get()
        if (!auth.refreshToken) {
            return null
        }

        set(
            (state) => ({
                auth: { ...state.auth, status: 'loading', error: null },
            }),
            false,
            'auth/refresh'
        )

        try {
            const response = await refreshRequest(auth.refreshToken)
            set(
                (state) => ({
                    auth: {
                        ...state.auth,
                        token: response?.access_token ?? state.auth.token,
                        refreshToken: response?.refresh_token ?? state.auth.refreshToken,
                        user: response?.user ?? state.auth.user,
                        status: 'authenticated',
                        error: null,
                    },
                }),
                false,
                'auth/refresh-success'
            )
            return response
        } catch (error) {
            set(
                (state) => ({
                    auth: {
                        ...state.auth,
                        status: 'error',
                        error: error?.message || 'Session refresh failed',
                    },
                }),
                false,
                'auth/refresh-error'
            )
            return null
        }
    },
    logout: async () => {
        set(
            {
                auth: { ...authInitialState },
                user: { data: null, status: 'idle', error: null },
                courses: { course: null, status: 'idle', error: null },
                sections: { items: [], selectedSectionId: null, selectedSection: null, status: 'idle', error: null },
            },
            false,
            'auth/logout'
        )
        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login'
        }
    },
})

export { authInitialState }
export default createAuthSlice
