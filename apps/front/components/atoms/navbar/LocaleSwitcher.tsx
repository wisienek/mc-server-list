'use client';
import {useState, type MouseEvent} from 'react';
import {useRouter} from 'next/navigation';
import {useLocale} from 'next-intl';
import Cookies from 'js-cookie';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import {styled} from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import {NextLocaleCookieKey} from '@front/consts';
import {routing} from '@front/i18n/routing';

const localeFlags: Record<string, string> = {
    en: '🇬🇧',
    pl: '🇵🇱',
    fr: '🇫🇷',
    it: '🇮🇹',
    de: '🇩🇪',
};

const LocaleContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
}));

const LocaleButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

const LocaleText = styled(Typography)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
}));

const LocaleMenuItem = styled(MenuItem)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
}));

const LocaleSwitcher = () => {
    const currentLocale = useLocale();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeLocale = (locale: string) => {
        Cookies.set(Symbol.keyFor(NextLocaleCookieKey), locale, {
            path: '/',
            expires: 365,
        });
        router.push(`/${locale}`);
        handleClose();
    };

    return (
        <LocaleContainer>
            <LocaleButton onClick={handleClick}>
                <LocaleText>
                    {localeFlags[currentLocale]} {currentLocale.toUpperCase()}
                    <ArrowDropDownIcon />
                </LocaleText>
            </LocaleButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {routing.locales
                    .filter((locale) => locale !== currentLocale)
                    .map((locale) => (
                        <LocaleMenuItem
                            key={locale}
                            onClick={() => handleChangeLocale(locale)}
                        >
                            {localeFlags[locale]} {locale.toUpperCase()}
                        </LocaleMenuItem>
                    ))}
            </Menu>
        </LocaleContainer>
    );
};

export default LocaleSwitcher;
