import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import StyledAppBar from '@front/components/atoms/navbar/StyledAppBar';
import Profile from '@front/components/atoms/navbar/Profile';
import MenuLogo from '@front/components/atoms/MenuLogo';

function Navbar() {
    return (
        <StyledAppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                    <MenuLogo />
                    <Profile />
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
}

export default Navbar;
