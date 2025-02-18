'use client';
import Box from '@mui/material/Box';
import {keyframes, styled} from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoaderWrapper = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    animation: `${fadeIn} 0.8s ease-out`,
}));

export default LoaderWrapper;
