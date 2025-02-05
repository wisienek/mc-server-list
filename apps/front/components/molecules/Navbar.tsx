'use client';
import AppBar from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import DiscordProfile from '../atoms/DiscordProfile';
import MenuLogo from '../atoms/MenuLogo';

const StyledAppBar = styled(AppBar)(({theme}) => ({
    background: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    zIndex: theme.zIndex.appBar,
}));

function Navbar() {
    return (
        <StyledAppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                    <MenuLogo />

                    <DiscordProfile />
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
}
export default Navbar;
