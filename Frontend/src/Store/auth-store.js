import { createSlice } from "@reduxjs/toolkit"

const initialState = {isLoggedIn : false,mobile : ''}

const authSlice = createSlice({
    name : "Auth",
    initialState,
    reducers : {
        login(state,action){
            state.isLoggedIn = true;
            state.mobile = action.payload.mobile
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("mobile",action.payload.mobile)
            localStorage.setItem("token",action.payload.token)
        },
        logout(state){
            state.isLoggedIn = false;
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("mobile");
            localStorage.removeItem("token")
        },
    }
})

export const authActions = authSlice.actions;

export default authSlice.reducer;

