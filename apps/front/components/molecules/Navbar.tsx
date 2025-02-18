'use client';

import {useAppSelector} from '@lib/front/components/store/store';
import AppBar from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import DiscordProfile from '@front/components/atoms/DiscordProfile';
import MenuLogo from '@front/components/atoms/MenuLogo';

const StyledAppBar = styled(AppBar)(({theme}) => ({
    background: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    zIndex: theme.zIndex.appBar,
}));

function Navbar() {
    const profile = useAppSelector((state) => state.auth.user);

    return (
        <>
            <StyledAppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                        <MenuLogo />
                        <DiscordProfile user={profile} />
                    </Toolbar>
                </Container>
            </StyledAppBar>
        </>
    );
}

export default Navbar;
