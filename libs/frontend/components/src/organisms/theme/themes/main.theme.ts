import type {ThemeOptions} from '@mui/material/styles';

const sharedMixin: ThemeOptions = {
    shape: {
        borderRadius: 15,
    },
};

const light: ThemeOptions = {
    ...sharedMixin,
    palette: {
        mode: 'light',
        primary: {
            main: '#4B5945',
        },
        secondary: {
            main: '#685752',
        },
        error: {
            main: '#DB3056',
            dark: '#851D41',
        },
        warning: {
            main: '#F88F01',
            dark: '#B15500',
        },
        info: {
            main: '#0070AC',
            dark: '#003371',
        },
        success: {
            main: '#2D6A4F',
            dark: '#004440',
        },
        common: {
            black: '#000000',
            white: '#FFFFFF',
        },
        grey: {
            50: '#ECECEC',
            100: '#D5D5D5',
            200: '#BEBEBE',
            300: '#A7A7A7',
            400: '#909090',
            500: '#797979',
            600: '#626262',
            700: '#4B4B4B',
            800: '#343434',
            900: '#1D1D1D',
        },
        text: {
            primary: '#2C2F33',
            secondary: '#4F545C',
            disabled: '#A3A3A3',
        },
        divider: '#D3D3D3',
        background: {
            default: '#EDEBE8',
            paper: '#FFFFFF',
        },
        action: {
            active: '#5865F2',
            hover: 'rgba(88, 101, 242, 0.08)',
            selected: 'rgba(88, 101, 242, 0.16)',
            disabled: '#A3A3A3',
            disabledBackground: '#E0E0E0',
            focus: 'rgba(88, 101, 242, 0.24)',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
};

const dark: ThemeOptions = {
    ...sharedMixin,
    palette: {
        mode: 'dark',
        primary: {
            main: '#9cc38f',
        },
        secondary: {
            main: '#aa9b97',
        },
        error: {
            main: '#F64B3C',
            dark: '#C81912',
        },
        warning: {
            main: '#EF8D32',
            dark: '#CC561E',
        },
        info: {
            main: '#3282B8',
            dark: '#0F4C75',
        },
        success: {
            main: '#4E8D7C',
            dark: '#045762',
        },
        text: {
            primary: '#f1f1f1',
            secondary: '#b0b3b8',
            disabled: '#6c757d',
        },
        background: {
            default: '#222831',
            paper: '#31363F',
        },
        common: {
            black: '#000000',
            white: '#FFFFFF',
        },
        grey: {
            50: '#E0E0E0',
            100: '#C2C2C2',
            200: '#A3A3A3',
            300: '#858585',
            400: '#666666',
            500: '#4D4D4D',
            600: '#333333',
            700: '#1A1A1A',
            800: '#0D0D0D',
            900: '#050505',
        },
        divider: '#444444',
        action: {
            active: '#5865F2',
            hover: 'rgba(88, 101, 242, 0.2)',
            selected: 'rgba(88, 101, 242, 0.3)',
            disabled: '#666666',
            disabledBackground: '#333333',
            focus: 'rgba(88, 101, 242, 0.4)',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
};

export default {
    light,
    dark,
};
