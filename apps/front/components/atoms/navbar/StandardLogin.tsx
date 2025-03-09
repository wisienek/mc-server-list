'use client';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';

const StandardLogin = () => {
    const t = useTranslations('profile');

    return (
        <Tooltip arrow title={t('login')}>
            <LoginIcon color="primary" sx={{cursor: 'pointer'}} onClick={() => {}} />
        </Tooltip>
    );
};

export default StandardLogin;
