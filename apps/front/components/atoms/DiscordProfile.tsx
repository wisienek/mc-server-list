import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import {UserDto} from '@shared/dto';
import {useTranslations} from 'next-intl';
import Logo from './icons/discord.svg';

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

type DiscordProfileProps = {
    user: UserDto;
};

const DiscordProfile = ({user}: DiscordProfileProps) => {
    const t = useTranslations('profile');

    const LoggedInIcon = () => {
        return (
            <Tooltip arrow title={user.email}>
                <StyledAvatar
                    alt="user avatar"
                    src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.webp?size=64`}
                />
            </Tooltip>
        );
    };

    const LoginWithDiscordIcon = () => {
        return (
            <Tooltip arrow title={t('login')}>
                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/users/discord/redirect`}
                    target="_blank"
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
