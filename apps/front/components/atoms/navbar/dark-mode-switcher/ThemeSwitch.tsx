'use client';

import {useAppDispatch, useAppSelector} from '@lib/front/components/store/store';
import {toggleTheme} from '@lib/front/components/store/themeSlice';
import IconButton from '@mui/material/IconButton';

import {StyledDarkIcon, StyledLightModeIcon} from './styles';

const ThemeSwitch = () => {
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((store) => store.theme.mode === 'dark');

    return (
        <IconButton onClick={() => dispatch(toggleTheme())}>
            {isDarkMode ? (
                <StyledDarkIcon key="dark" />
            ) : (
                <StyledLightModeIcon key="light" />
            )}
        </IconButton>
    );
};

export default ThemeSwitch;
