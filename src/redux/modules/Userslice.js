import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
    password:"",
};
const UserSlice = createSlice({
    name:'member',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.email=action.payload.email;
            state.password=action.payload.password;
        },
    },
});
export const { setUser } = UserSlice.actions;
export const selectEmail = (state) => state.user.email;
export const selectPassword = (state) => state.user.password;

export default UserSlice;