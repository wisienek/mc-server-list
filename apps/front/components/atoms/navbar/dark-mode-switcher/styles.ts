'use client';

import {styled} from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export const StyledDarkIcon = styled(DarkModeIcon)(() => ({
    color: '#1882c4',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
    },
    '&.fade-enter': {
        opacity: 0,
    },
    '&.fade-enter-active': {
        opacity: 1,
    },
}));

export const StyledLightModeIcon = styled(LightModeIcon)(() => ({
    color: '#e0d30f',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
    },
    '&.fade-enter': {
        opacity: 0,
    },
    '&.fade-enter-active': {
        opacity: 1,
    },
}));
