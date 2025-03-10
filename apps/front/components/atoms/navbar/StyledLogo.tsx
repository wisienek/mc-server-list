'use client';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const StyledLogo = styled('div')(({theme}) => ({
    userSelect: 'none',
    height: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
    cursor: 'pointer',

    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

export const StyledTitle = styled(Typography)(({theme}) => ({
    mr: 2,
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));
