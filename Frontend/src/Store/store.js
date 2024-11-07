import { configureStore } from "@reduxjs/toolkit";
import authStore from "./auth-store";

const store = configureStore({
    reducer : {
        auth : authStore,
    }
})

export default store;