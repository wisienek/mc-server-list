'use client';
import {styled} from '@mui/material/styles';

const StyledPageContainer = styled('section')(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
}));

export default StyledPageContainer;
