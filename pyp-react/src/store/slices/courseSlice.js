import { createCourse as createCourseRequest, fetchCourses, fetchCourseById as fetchCourseByIdRequest, deleteCourse as deleteCourseRequest } from '../../services/courses.js'

const coursesInitialState = {
    course: null,
    items: [],
    status: 'idle',
    error: null,
}

const createCourseSlice = (set, get) => ({
    courses: { ...coursesInitialState },
    setCoursesStatus: (status) =>
        set(
            (state) => ({
                courses: { ...state.courses, status },
            }),
            false,
            'courses/status'
        ),
    setCoursesError: (error) =>
        set(
            (state) => ({
                courses: { ...state.courses, error },
            }),
            false,
            'courses/error'
        ),
    clearCourses: () =>
        set(
            {
                courses: { ...coursesInitialState },
            },
            false,
            'courses/clear'
        ),
    fetchCourses: async () => {
        const token = get().auth?.token

        set(
            (state) => ({
                courses: {
                    ...state.courses,
                    status: 'loading',
                    error: null,
                },
            }),
            false,
            'courses/fetch-loading'
        )

        try {
            const response = await fetchCourses(token)
            const items = (response ?? []).map((course) => ({
                id: course._id ?? course.id,
                userId: course.user_id,
                prompt: course.prompt,
                title: course.title,
                description: course.description ?? '',
                sections: course.sections ?? [],
                sectionTitles: course.section_titles ?? [],
                createdAt: course.created_at || course.createdAt,
                updatedAt: course.updated_at || course.updatedAt,
            }))

            set(
                (state) => ({
                    courses: {
                        ...state.courses,
                        items,
                        status: 'success',
                        error: null,
                    },
                }),
                false,
                'courses/fetch-success'
            )

            return items
        } catch (error) {
            console.error('Failed to load courses:', error)
            set(
                (state) => ({
                    courses: {
                        ...state.courses,
                        status: 'error',
                        error: error?.message || 'Failed to load courses',
                    },
                }),
                false,
                'courses/fetch-error'
            )
            return null
        }
    },
    fetchCourseById: async (courseId) => {
        const token = get().auth?.token
        set(
            (state) => ({
                courses: {
                    ...state.courses,
                    status: 'loading',
                    error: null,
                },
            }),
            false,
            'courses/fetch-one'
        )

        try {
            const response = await fetchCourseByIdRequest(token, courseId)
            const course = {
                id: response._id ?? response.id,
                userId: response.user_id,
                prompt: response.prompt,
                title: response.title,
                description: response.description ?? '',
                sections: response.sections ?? [],
                sectionTitles: response.section_titles ?? [],
            }

            set(
                (state) => ({
                    courses: {
                        ...state.courses,
                        course,
                        status: 'success',
                        error: null,
                    },
                }),
                false,
                'courses/fetch-one-success'
            )
            return course
        } catch (error) {
            set(
                (state) => ({
                    courses: { ...state.courses, status: 'error', error: error?.message || 'Failed to load course' },
                }),
                false,
                'courses/fetch-one-error'
            )
            return null
        }
    },
    createCourse: async (topic) => {
        const token = get().auth?.token
        const userId = get().auth?.user?.id

        if (!userId) {
            set(
                (state) => ({
                    courses: { ...state.courses, status: 'error', error: 'User not authenticated' },
                }),
                false,
                'courses/create-error'
            )
            return null
        }

        set(
            (state) => ({
                courses: { ...state.courses, status: 'loading', error: null },
            }),
            false,
            'courses/create'
        )

        try {
            const response = await createCourseRequest(token, userId, topic)
            const newCourse = response
                ? {
                    id: response._id ?? response.id,
                    userId: response.user_id,
                    prompt: response.prompt,
                    title: response.title,
                    description: response.description ?? '',
                    sections: response.sections ?? [],
                    sectionTitles: response.section_titles ?? [],
                }
                : null
            set(
                (state) => ({
                    courses: {
                        ...state.courses,
                        course: newCourse ?? state.courses.course,
                        status: 'success',
                        error: null,
                    },
                }),
                false,
                'courses/create-success'
            )
            return newCourse
        } catch (error) {
            set(
                (state) => ({
                    courses: { ...state.courses, status: 'error', error: error?.message || 'Failed to create course' },
                }),
                false,
                'courses/create-error'
            )
            return null
        }
    },
    deleteCourse: async (courseId) => {
        const token = get().auth?.token

        set(
            (state) => ({
                courses: { ...state.courses, status: 'loading', error: null },
            }),
            false,
            'courses/delete-loading'
        )

        try {
            await deleteCourseRequest(token, courseId)
            
            set(
                (state) => ({
                    courses: {
                        ...state.courses,
                        items: state.courses.items.filter(course => course.id !== courseId),
                        status: 'success',
                        error: null,
                    },
                }),
                false,
                'courses/delete-success'
            )
            return true
        } catch (error) {
            set(
                (state) => ({
                    courses: { ...state.courses, status: 'error', error: error?.message || 'Failed to delete course' },
                }),
                false,
                'courses/delete-error'
            )
            return false
        }
    },
})

export { coursesInitialState }
export default createCourseSlice
