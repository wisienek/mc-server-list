'use client';
import Avatar from '@mui/material/Avatar';
import {styled} from '@mui/material/styles';

export default styled(Avatar)(({theme}) => ({
    boxShadow: theme.shadows[7],
    padding: `0 !important`,
}));
