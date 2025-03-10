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
    '& > *': {
        width: `${theme.spacing(5)} !important`,
        height: `${theme.spacing(5)} !important`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1 / 2),
    },
}));
