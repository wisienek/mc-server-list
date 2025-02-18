'use client';
import {styled} from '@mui/material/styles';

const StyledTemplateBody = styled('main')(({theme}) => ({
    padding: `0 ${theme.spacing(40)}`,
    width: '100%',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',

    [theme.breakpoints.down('lg')]: {
        padding: `0 ${theme.spacing(15)}`,
    },
    [theme.breakpoints.down('md')]: {
        padding: 0,
    },
}));

export default StyledTemplateBody;
