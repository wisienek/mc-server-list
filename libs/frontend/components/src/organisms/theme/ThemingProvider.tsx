'use client';
import {type ReactNode, useMemo, useEffect, useState} from 'react';
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {useAppSelector} from '../../store/store';
import Themes, {type ThemeNames, type ThemeTypes} from './themes';

type ProviderProps = {
    defaultTheme?: ThemeNames;
    children: ReactNode;
};

type CreateThemeProps = Parameters<typeof createTheme>[0];

const ThemeDefaultOptions = {} as const satisfies CreateThemeProps;

function ThemingProvider({children, defaultTheme = 'main'}: ProviderProps) {
    const reduxThemeMode = useAppSelector((store) => store.theme.mode);
    const [themeMode, setThemeMode] = useState<ThemeTypes | null>(null);

    useEffect(() => {
        setThemeMode(reduxThemeMode);
    }, [reduxThemeMode]);

    const currentTheme = useMemo(() => {
        if (!themeMode || !Themes[defaultTheme][themeMode]) {
            return createTheme();
        }

        return createTheme({
            ...Themes[defaultTheme][themeMode],
            ...ThemeDefaultOptions,
        });
    }, [defaultTheme, themeMode]);

    if (!themeMode) {
        return null;
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    );
}

export default ThemingProvider;
