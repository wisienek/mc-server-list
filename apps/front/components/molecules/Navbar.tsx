'use client';

import {useAppSelector} from '@lib/front/components/store/store';
import AppBar from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import CreateServerButton from '@front/components/atoms/AddServerButton';
import CreateServerModal from '@front/components/organisms/CreateServerModal';
import DiscordProfile from '@front/components/atoms/DiscordProfile';
import MenuLogo from '@front/components/atoms/MenuLogo';

const StyledAppBar = styled(AppBar)(({theme}) => ({
    background: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    zIndex: theme.zIndex.appBar,
}));

function Navbar() {
    const profile = useAppSelector((state) => state.auth.user);
    const [showingCreateModal, setShowingCreateModal] = useState<boolean>(false);
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalContainer(document.getElementById('modal-root'));
    }, []);

    const ShowAddServerButton = () => {
        return profile ? (
            <CreateServerButton handleOpen={() => setShowingCreateModal(true)} />
        ) : null;
    };

    return (
        <>
            <StyledAppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{justifyContent: 'space-between'}}>
                        <MenuLogo />
                        <ShowAddServerButton />
                        <DiscordProfile user={profile} />
                    </Toolbar>
                </Container>
            </StyledAppBar>

            {showingCreateModal &&
                modalContainer &&
                createPortal(
                    <CreateServerModal
                        open={showingCreateModal}
                        handleClose={() => setShowingCreateModal(false)}
                    />,
                    modalContainer,
                )}
        </>
    );
}

export default Navbar;
