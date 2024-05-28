import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
    name: string;
    employee_id: string;
    email : string,
    contact : string,
}

interface AuthState {
    status: boolean;
    userData: UserData | null;
}

const initialState: AuthState = {
    status: false,
    userData: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login: (state, action: PayloadAction<UserData>) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export type { UserData as UserDataType };

export default authSlice.reducer;
