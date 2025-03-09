'use client';
import {type ReactNode, useMemo} from 'react';
import {createTheme, StyledEngineProvider, ThemeProvider} from '@mui/material';
import {useAppSelector} from '../../store/store';

import Themes, {type ThemeNames, type ThemeTypes} from './themes';

type ProviderProps = {
    defaultTheme?: ThemeNames;
    defaultType?: ThemeTypes;
    children: ReactNode;
};

type CreateThemeProps = Parameters<typeof createTheme>[0];

const ThemeDefaultOptions = {} as const satisfies CreateThemeProps;

function ThemingProvider({children, defaultTheme = 'main'}: ProviderProps) {
    const themeMode = useAppSelector((store) => store.theme.mode);

    const currentTheme = useMemo(() => {
        if (!Themes[defaultTheme][themeMode]) {
            console.warn(`Invalid theme: ${themeMode}`);
            return createTheme();
        }

        return createTheme({
            ...Themes[defaultTheme][themeMode],
            ...ThemeDefaultOptions,
        });
    }, [defaultTheme, themeMode]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={currentTheme} noSsr>
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default ThemingProvider;
