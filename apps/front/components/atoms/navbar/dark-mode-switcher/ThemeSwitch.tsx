'use client';

import {useAppDispatch, useAppSelector} from '@lib/front/components/store/store';
import {toggleTheme} from '@lib/front/components/store/themeSlice';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';

import {StyledDarkIcon, StyledLightModeIcon} from './styles';

const ThemeSwitch = () => {
    const t = useTranslations('themes');
    const dispatch = useAppDispatch();
    const themeMode = useAppSelector((store) => store.theme.mode);

    return (
        <Tooltip
            arrow
            title={t(themeMode === 'dark' ? 'switchToLight' : 'switchToDark')}
        >
            <IconButton onClick={() => dispatch(toggleTheme())}>
                {themeMode === 'dark' ? (
                    <StyledDarkIcon key="dark" />
                ) : (
                    <StyledLightModeIcon key="light" />
                )}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeSwitch;
