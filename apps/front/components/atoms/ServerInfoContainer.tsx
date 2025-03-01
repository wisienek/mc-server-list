import Grid from '@mui/material/Grid2';
import {styled} from '@mui/material/styles';

const ServerInfoContainer = styled(Grid, {
    shouldForwardProp: (propName: string) =>
        !['direction', 'usePadding', 'changeDirectionOnSmallSize'].includes(
            propName,
        ),
})<{
    direction: 'column' | 'column-reverse' | 'row' | 'row-reverse';
    usePadding?: boolean;
    changeDirectionOnSmallSize?: boolean;
}>(({theme, direction, usePadding = true, changeDirectionOnSmallSize = true}) => ({
    padding: usePadding ? theme.spacing(3) : 0,
    display: 'flex',
    flexDirection: direction,
    justifyContent: 'space-between',
    alignItems: 'normal',
    ...(changeDirectionOnSmallSize
        ? {
              [theme.breakpoints.down('md')]: {
                  flexDirection: direction.includes('row')
                      ? `column${direction.includes('reverse') ? '-reverse' : ''}`
                      : direction,
              },
          }
        : {}),
}));

export default ServerInfoContainer;
