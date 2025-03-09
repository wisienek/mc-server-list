'use client';

import AppBar from '@mui/material/AppBar';
import {styled} from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({theme}) => ({
    background: theme.palette.background.paper,
    textColor: theme.palette.text.primary,
    zIndex: theme.zIndex.appBar,
}));

export default StyledAppBar;
