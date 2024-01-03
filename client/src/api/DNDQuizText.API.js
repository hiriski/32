import { Axios } from 'src/api'

export const DNDQuizTextAPI = {
    admin_save: async payload => {
        const response = await Axios.post(
            '/server/api/admin/quiz/dnd/text',
            payload
        )
        return response?.data
    },
    admin_getAll: async params => {
        const response = await Axios.get('/server/api/admin/quiz/dnd/text', {
            params,
        })
        return response?.data
    },
}
