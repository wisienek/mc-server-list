import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

type ThemeTypes = 'light' | 'dark';

const SELECTED_THEME_MODE = 'SELECTED_THEME_MODE';

interface ThemeState {
    mode: ThemeTypes;
}

const getInitialTheme = (): ThemeTypes => {
    const savedTheme = Cookies.get(SELECTED_THEME_MODE) as ThemeTypes;
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme(state) {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
            Cookies.set(SELECTED_THEME_MODE, state.mode, {expires: 365});
        },
        setTheme(state, action: PayloadAction<ThemeTypes>) {
            state.mode = action.payload;
            Cookies.set(SELECTED_THEME_MODE, action.payload, {expires: 365});
        },
    },
});

export const {toggleTheme, setTheme} = themeSlice.actions;
export default themeSlice.reducer;
