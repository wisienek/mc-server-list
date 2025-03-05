'use client';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';

export const StyledOrderedList = styled(List)(({theme}) => ({
    paddingLeft: theme.spacing(2),
    listStyleType: 'decimal',
    color: theme.palette.text.primary,
    '& li::marker': {
        color: theme.palette.text.primary,
    },
}));
