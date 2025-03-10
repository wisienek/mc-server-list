'use client';
import {openModal} from '@lib/front/components/store/modalSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';

const StandardLogin = () => {
    const t = useTranslations('profile');
    const dispatch = useAppDispatch();

    return (
        <Tooltip arrow title={t('login')}>
            <LoginIcon
                color="primary"
                sx={{cursor: 'pointer'}}
                onClick={() => dispatch(openModal('login'))}
            />
        </Tooltip>
    );
};

export default StandardLogin;
