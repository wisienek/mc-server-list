'use client';
import {ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material';
import Cookies from 'js-cookie';

import Themes, {type ThemeNames, type ThemeTypes} from './themes';

type ProviderProps = {
    defaultTheme?: ThemeNames;
    defaultType?: ThemeTypes;
    children: ReactNode;
};

const SELECTED_THEME_MODE = 'SELECTED_THEME_MODE' as const;

function ThemingProvider({
    children,
    defaultTheme = 'main',
    defaultType = 'dark',
}: ProviderProps) {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [themeMode, setThemeMode] = useState<ThemeTypes>(defaultType);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const initializeThemeSettings = useCallback(() => {
        const savedMode =
            (Cookies.get(SELECTED_THEME_MODE) as ThemeTypes) || defaultType;

        Cookies.set(SELECTED_THEME_MODE, savedMode);

        setThemeMode(savedMode);
    }, [defaultType]);

    useEffect(() => {
        if (isClient) {
            initializeThemeSettings();
        }
    }, [isClient, initializeThemeSettings]);

    const currentTheme = useMemo(() => {
        if (!Themes[defaultTheme][themeMode]) {
            console.warn(`Invalid theme: ${themeMode}`);
            return createTheme();
        }

        return createTheme(Themes[defaultTheme][themeMode]);
    }, [defaultTheme, themeMode]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    );
}

export default ThemingProvider;
