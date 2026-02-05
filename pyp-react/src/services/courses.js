import { authRequest } from './apiClient.js'

const fetchCourses = async (token) => {
    return authRequest('/course/all', token)
}

const fetchCourseById = async (token, courseId) => {
    return authRequest(`/course/${courseId}`, token)
}

const createCourse = async (token, userId, promptText) => {
    return authRequest('/course/', token, {
        method: 'POST',
        body: {
            user_id: userId,
            prompt_text: promptText,
        },
    })
}

const deleteCourse = async (token, courseId) => {
    return authRequest(`/course/${courseId}`, token, {
        method: 'DELETE',
    })
}


export { fetchCourses, fetchCourseById, createCourse, deleteCourse }
