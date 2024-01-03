import { createSlice } from '@reduxjs/toolkit'
import { dndQuizText_adminGetList } from './dndQuizText.thunk'

// Initial state
const initialState = {
    adminListIsLoading: false,
    adminListIsError: false,
    adminListData: [],
}

// Actual Slice
export const dndQuizTextSlice = createSlice({
    name: 'dndQuizText',
    initialState,
    reducers: {
        dndQuizText_setModalForm(state, action) {
            state.modalForm = action.payload
        },
        dndQuizText_setOpenModalListReward(state, action) {
            state.openModalListReward = action.payload
        },
        dndQuizText_setOpenModalListMyReward(state, action) {
            state.openModalListMyReward = action.payload
        },
        dndQuizText_setOpenModalClaimReward(state, action) {
            state.openModalClaimReward = action.payload
        },
        dndQuizText_setModalDetail(state, action) {
            state.modalDetail = action.payload
        },
        dndQuizText_reset: () => initialState,
    },
    extraReducers: builder => {
        // Get list reward for admin
        builder.addCase(dndQuizText_adminGetList.pending, state => {
            state.adminListIsLoading = true
            state.adminListIsError = false
        })
        builder.addCase(dndQuizText_adminGetList.rejected, (state, action) => {
            state.adminListIsLoading = false
            state.adminListIsError = true
        })
        builder.addCase(dndQuizText_adminGetList.fulfilled, (state, action) => {
            state.adminListIsError = false
            state.adminListIsLoading = false
            state.adminListData = action.payload?.data || []
        })
    },
})

export const dndQuizText_reducerActions = dndQuizTextSlice.actions

export const dndQuizText_selectState = state => state.dndQuizText
