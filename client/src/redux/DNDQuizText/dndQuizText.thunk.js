import { createAsyncThunk } from '@reduxjs/toolkit'
import { DNDQuizTextAPI } from 'src/api'

export const dndQuizText_adminGetList = createAsyncThunk(
    '@dndQuizText/dndQuizText_adminGetList',
    async (body, { rejectWithValue }) => {
        try {
            const response = await DNDQuizTextAPI.admin_getAll(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)

export const dndQuizText_adminSave = createAsyncThunk(
    '@dndQuizText/dndQuizText_adminSave',
    async (body, { rejectWithValue }) => {
        try {
            const response = await DNDQuizTextAPI.admin_save(body)
            return response
        } catch (err) {
            if (!err.response) {
                throw err
            }
            return rejectWithValue(err.response.data)
        }
    }
)
