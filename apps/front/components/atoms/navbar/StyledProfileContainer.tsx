'use client';
import {styled} from '@mui/material/styles';

export default styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
        marginLeft: 'auto',
    },
}));
