import {styled, type Theme} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import Logo from './icons/discord.svg';

const StyledContainer = styled(Box)(({theme}) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        marginLeft: 'auto',
    },
}));

const LoginIcon = styled(Logo)((_: {theme: Theme}) => ({
    cursor: 'pointer',
}));

type DiscordProfileProps = {
    avatar?: string;
};

const DiscordProfile = ({avatar}: DiscordProfileProps) => {
    const t = useTranslations('profile');

    const AvatarIcon = () =>
        avatar ? (
            <Avatar alt="user avatar" src={avatar} />
        ) : (
            <Tooltip arrow title={t('login')}>
                <LoginIcon />
            </Tooltip>
        );

    return (
        <StyledContainer>
            <AvatarIcon />
        </StyledContainer>
    );
};

export default DiscordProfile;
