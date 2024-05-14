import { createSlice } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";

const initialState = {
    email:"",
    password:"",
};
// const SET_USER = 'SET_USER';
// export const getToken = data => ({type:SET_USER, data});
//const state = useSelector((state)=>state);
export const Member = createSlice({
   
    name:'member',
    initialState,
    reducer: {
        login(state, action) {
            state.isLogged = true;
            state.email =action.payload.email;
            state.password = action.payload.password;
        },
        logout(state) {
            state.isLogged = false;
            state.email = null;
            state.password= null;
        }
    },
});

export const {login, logout} = Member.actions;
export default Member.reducer;