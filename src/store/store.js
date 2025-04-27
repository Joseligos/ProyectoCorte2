import { configureStore } from "@reduxjs/toolkit";
import bibliotecaSlice from "./slices/bibliotecaSlice.js"

export const store = configureStore({
    reducer: {
        biblioteca: bibliotecaSlice
    }
})