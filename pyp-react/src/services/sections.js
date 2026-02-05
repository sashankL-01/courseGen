import { authRequest } from './apiClient.js'

const fetchSectionDetails = async (token, courseId, sectionId) =>
    authRequest('/section/', token, {
        method: 'POST',
        body: {
            course_id: courseId,
            section_id: sectionId,
        },
    })

export { fetchSectionDetails }
