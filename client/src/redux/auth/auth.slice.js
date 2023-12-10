import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
    auth_openModalLogin: false,
    auth_openModalRegister: false,
    user: null,
    newUser: false,
}

// Actual Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        auth_setOpenModalLogin(state, action) {
            state.auth_openModalLogin = action.payload
        },
        auth_setOpenModalRegister(state, action) {
            state.auth_openModalRegister = action.payload
        },
        auth_setUser(state, action) {
            state.user = action.payload
        },
        auth_setNewUser(state, action) {
            state.newUser = action.payload
        },
    },
})

export const auth_reducerActions = authSlice.actions

export const auth_selectState = state => state.auth