import { authRequest, request, requestForm } from './apiClient.js'

const register = async ({ username, email, password }) =>
    request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
    })

const login = async ({ email, password }) =>
    requestForm('/auth/login', {
        username: email,
        password,
    })

const refresh = async (refreshToken) =>
    request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify(refreshToken),
    })

const requestPasswordReset = async (email) =>
    request('/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
    })

const confirmPasswordReset = async ({ token, newPassword }) =>
    request('/auth/reset-password/confirm', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: newPassword }),
    })

const logout = async (token) =>
    authRequest('/auth/logout', token, {
        method: 'POST',
    })

export {
    register,
    login,
    refresh,
    requestPasswordReset,
    confirmPasswordReset,
    logout,
}
