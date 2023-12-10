// Redux Toolkit
import { combineReducers } from '@reduxjs/toolkit'

// Slices & Apis
import { appSlice } from './app'
import { authSlice } from './auth'
import { userSlice } from './user'

// plain reducers
const plainReducers = {
    [appSlice.name]: appSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
}

// root reducer
const combinedReducer = combineReducers(plainReducers)

const rootReducer = (state, action) => {
    return combinedReducer(state, action)
}

export { plainReducers, rootReducer }