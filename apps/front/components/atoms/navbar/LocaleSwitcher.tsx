'use client';
import {useState, type MouseEvent, type FC} from 'react';
import {useLocale} from 'next-intl';
import Cookies from 'js-cookie';
import Image from 'next/image';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import {styled} from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import {routing, usePathname, useRouter} from '@front/i18n/routing';
import {NextLocaleCookieKey} from '@front/consts';

const localeFlags: Record<string, string> = {
    en: '/flags/en.svg',
    pl: '/flags/pl.svg',
    fr: '/flags/fr.svg',
    it: '/flags/it.svg',
    de: '/flags/de.svg',
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
    width: theme.spacing(10),
}));

type LocaleFlagInput = {
    locale: keyof typeof localeFlags | string;
};

const LocaleFlag: FC<LocaleFlagInput> = ({locale}) => {
    return (
        <Image
            src={localeFlags[locale]}
            alt={locale}
            width={24}
            height={16}
            style={{borderRadius: 2}}
        />
    );
};

const LocaleSwitcher = () => {
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

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
        router.replace(pathname, {locale: locale});
        handleClose();
    };

    return (
        <LocaleContainer>
            <LocaleButton onClick={handleClick}>
                <LocaleText>
                    <LocaleFlag locale={currentLocale} />{' '}
                    {currentLocale.toUpperCase()}
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
                            <LocaleFlag locale={locale} />
                            {locale.toUpperCase()}
                        </LocaleMenuItem>
                    ))}
            </Menu>
        </LocaleContainer>
    );
};

export default LocaleSwitcher;
