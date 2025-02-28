import Grid from '@mui/material/Grid2';
import {styled} from '@mui/material/styles';

const ServerInfoContainer = styled(Grid, {
    shouldForwardProp: (propName: string) =>
        !['direction', 'usePadding'].includes(propName),
})<{
    direction: 'column' | 'column-reverse' | 'row' | 'row-reverse';
    usePadding?: boolean;
}>(({theme, direction, usePadding = true}) => ({
    padding: usePadding ? theme.spacing(3) : 0,
    display: 'flex',
    flexDirection: direction,
    justifyContent: 'space-between',
    alignItems: 'normal',
    [theme.breakpoints.down('md')]: {
        flexDirection: direction.includes('row')
            ? `column${direction.includes('reverse') ? '-reverse' : ''}`
            : direction,
    },
}));

export default ServerInfoContainer;
