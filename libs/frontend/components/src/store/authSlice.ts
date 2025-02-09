import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {UserDto} from '@shared/dto';

interface AuthState {
    isLoggedIn: boolean;
    isFirstLogin: boolean;
    user: UserDto | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    isFirstLogin: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserDto>) {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isFirstLogin = false;
        },
        setIsFirstLogin(state, action: PayloadAction<boolean>) {
            state.isFirstLogin = action.payload;
        },
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.isFirstLogin = false;
        },
    },
});

export const {setUser, setIsFirstLogin, logout} = authSlice.actions;
export default authSlice.reducer;
