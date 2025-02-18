import type {ThemeOptions} from '@mui/material/styles';
import Main from './main.theme';

type ThemeConfig = {
    light: ThemeOptions;
    dark: ThemeOptions;
};

const themes: Record<string, ThemeConfig> = {
    main: Main,
};

export type ThemeTypes = keyof ThemeConfig;
export type ThemeNames = keyof typeof themes;
export default themes;
