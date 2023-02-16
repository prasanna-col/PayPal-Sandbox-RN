import { configureStore } from '@reduxjs/toolkit'
import AppReduxSlice from './silce';
export const store = configureStore({
    reducer: {
        MYSTORE: AppReduxSlice
    },
})