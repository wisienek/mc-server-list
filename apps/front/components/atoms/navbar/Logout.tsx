'use client';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';
import {FC} from 'react';
import {useUserLogout} from '@front/components/queries/user/userLogout';

const Logout: FC = () => {
    const t = useTranslations('profile');
    const {mutate: logoutFunc} = useUserLogout();

    return (
        <Tooltip arrow title={t('logout')}>
            <ExitToAppIcon
                color="error"
                sx={{cursor: 'pointer'}}
                onClick={() => logoutFunc()}
            />
        </Tooltip>
    );
};

export default Logout;
