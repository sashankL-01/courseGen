import { fetchSectionDetails } from '../../services/sections.js'

const sectionsInitialState = {
    section: null,
    courseTitle: null,
    courseId: null,
    allSections: [],
    status: 'idle',
    error: null,
}

const createSectionSlice = (set, get) => ({
    sections: { ...sectionsInitialState },
    setSectionsStatus: (status) =>
        set(
            (state) => ({
                sections: { ...state.sections, status },
            }),
            false,
            'sections/status'
        ),
    setSectionsError: (error) =>
        set(
            (state) => ({
                sections: { ...state.sections, error },
            }),
            false,
            'sections/error'
        ),
    clearSections: () =>
        set(
            {
                sections: { ...sectionsInitialState },
            },
            false,
            'sections/clear'
        ),
    fetchSectionById: async (courseId, sectionId) => {
        const token = get().auth?.token
        const { courses } = get()
        const course = courses.course

        set(
            (state) => ({
                sections: {
                    ...state.sections,
                    status: 'loading',
                    error: null,
                },
            }),
            false,
            'sections/fetch-one'
        )

        try {
            const response = await fetchSectionDetails(token, courseId, sectionId)

            const allSections = course?.sections?.map((secId, index) => ({
                id: secId,
                title: course.sectionTitles?.[index] ?? `Section ${index + 1}`,
                order: index,
            })) ?? []

            const section = response ? {
                id: response._id ?? response.id,
                courseId: response.course_id ?? courseId,
                title: response.title,
                content: response.content ?? '',
                order: response.order ?? 0,
            } : null

            set(
                (state) => ({
                    sections: {
                        ...state.sections,
                        section,
                        courseTitle: course?.title ?? null,
                        courseId,
                        allSections,
                        status: 'success',
                        error: null,
                    },
                }),
                false,
                'sections/fetch-one-success'
            )
            return section
        } catch (error) {
            set(
                (state) => ({
                    sections: { ...state.sections, status: 'error', error: error?.message || 'Failed to load section' },
                }),
                false,
                'sections/fetch-one-error'
            )
            return null
        }
    },
})

export default createSectionSlice
