import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {UserDto} from '@shared/dto';
import {useTranslations} from 'next-intl';
import useUserCookie from '../helpers/getUserFromCookieOrDestroy';
import Logo from './icons/discord.svg';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const StyledContainer = styled(Box)(({theme}) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        marginLeft: 'auto',
    },
}));

const StyledAvatar = styled(Avatar)(({theme}) => ({
    boxShadow: theme.shadows[7],
}));

const LoginIcon = styled(Logo)(() => ({
    cursor: 'pointer',
}));

const AvatarContainer = styled(Box)(() => ({
    position: 'relative',
    display: 'inline-block',
    boxSizing: 'border-box',
    '&:hover': {
        borderRadius: '50%',
    },
    '&:hover .logout-icon': {
        transform: 'translateX(0)',
        opacity: 1,
    },
}));

const LogoutIconContainer = styled(Box)(({theme}) => ({
    position: 'absolute',
    right: -30,
    bottom: 0,
    opacity: 0,
    transform: 'translateX(70%)',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',

    [theme.breakpoints.down('sm')]: {
        transform: 'translateX(0)',
        opacity: 1,
    },
}));

type DiscordProfileProps = {
    user: UserDto;
};

const DiscordProfile = ({user}: DiscordProfileProps) => {
    const t = useTranslations('profile');
    const {internalLogout} = useUserCookie();

    const LoggedInIcon = () => {
        return (
            <AvatarContainer>
                <Tooltip arrow title={user.email}>
                    <StyledAvatar
                        alt="user avatar"
                        src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.webp?size=64`}
                    />
                </Tooltip>
                <Tooltip arrow title={t('logout')}>
                    <LogoutIconContainer className="logout-icon">
                        <ExitToAppIcon
                            color="error"
                            sx={{cursor: 'pointer'}}
                            onClick={internalLogout}
                        />
                    </LogoutIconContainer>
                </Tooltip>
            </AvatarContainer>
        );
    };

    const LoginWithDiscordIcon = () => {
        return (
            <Tooltip arrow title={t('loginDiscord')}>
                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/users/discord/redirect`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <LoginIcon />
                </a>
            </Tooltip>
        );
    };

    const AvatarIcon = () => (user ? <LoggedInIcon /> : <LoginWithDiscordIcon />);

    return (
        <StyledContainer>
            <AvatarIcon />
        </StyledContainer>
    );
};

export default DiscordProfile;
