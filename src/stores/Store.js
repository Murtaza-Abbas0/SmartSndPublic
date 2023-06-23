import { configureStore } from '@reduxjs/toolkit'
import { userAuthSlice } from './slices'

export const Store = configureStore({
    reducer: {
        userAuth: userAuthSlice,
    },
})