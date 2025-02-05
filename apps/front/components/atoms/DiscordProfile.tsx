import {styled, type Theme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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
    const AvatarIcon = () =>
        avatar ? <Avatar alt="user avatar" src={avatar} /> : <LoginIcon />;

    return (
        <StyledContainer>
            <AvatarIcon />
        </StyledContainer>
    );
};

export default DiscordProfile;
