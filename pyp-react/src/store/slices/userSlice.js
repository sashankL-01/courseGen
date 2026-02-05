// Matches backend UserResponse model
const userInitialState = {
    data: null, // Full user object: { id, username, email, is_active, is_admin, created_at, profile_picture }
    status: 'idle',
    error: null,
}

const createUserSlice = (set) => ({
    user: { ...userInitialState },
    setUser: (userData) =>
        set(
            (state) => ({
                user: {
                    ...state.user,
                    data: userData
                        ? {
                            id: userData._id ?? userData.id,
                            username: userData.username,
                            email: userData.email,
                            isActive: userData.is_active ?? true,
                            isAdmin: userData.is_admin ?? false,
                            createdAt: userData.created_at,
                            profilePicture: userData.profile_picture ?? null,
                        }
                        : null,
                },
            }),
            false,
            'user/set'
        ),
    updateProfilePicture: (pictureUrl) =>
        set(
            (state) => ({
                user: {
                    ...state.user,
                    data: state.user.data
                        ? {
                            ...state.user.data,
                            profilePicture: pictureUrl,
                        }
                        : null,
                },
            }),
            false,
            'user/update-picture'
        ),
    setUserStatus: (status) =>
        set(
            (state) => ({
                user: { ...state.user, status },
            }),
            false,
            'user/status'
        ),
    setUserError: (error) =>
        set(
            (state) => ({
                user: { ...state.user, error },
            }),
            false,
            'user/error'
        ),
    clearUser: () =>
        set(
            {
                user: { ...userInitialState },
            },
            false,
            'user/clear'
        ),
})

export { userInitialState }
export default createUserSlice
