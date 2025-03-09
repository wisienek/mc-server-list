import Tooltip from '@mui/material/Tooltip';
import {useTranslations} from 'next-intl';
import {DiscordIcon} from '../icons';

export default function LoginWithDiscord() {
    const t = useTranslations('profile');

    return (
        <Tooltip arrow title={t('loginDiscord')}>
            <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/users/discord/redirect`}
                target="_blank"
                rel="noreferrer"
            >
                <DiscordIcon sx={{cursor: 'pointer'}} />
            </a>
        </Tooltip>
    );
}
