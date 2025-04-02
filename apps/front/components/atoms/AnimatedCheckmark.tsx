'use client';
import {keyframes, styled} from '@mui/material/styles';
import {CheckmarkIcon} from '@front/components/atoms/icons';

const stroke = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const fill = keyframes`
  to {
    box-shadow: inset 0px 0px 0px 30px currentColor;
  }
`;

const scale = keyframes`
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
`;

const AnimatedCheckmark = styled(CheckmarkIcon)(({theme}) => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'block',
    strokeWidth: 2,
    stroke: '#fff',
    strokeMiterlimit: 10,
    margin: '10% auto',
    color: theme.palette.success.main,
    boxShadow: 'inset 0px 0px 0px currentColor',
    animation: `${fill} 0.4s ease-in-out 0.4s forwards, ${scale} 0.3s ease-in-out 0.9s both`,
    '& .checkmark__circle': {
        strokeDasharray: 166,
        strokeDashoffset: 166,
        strokeWidth: 2,
        strokeMiterlimit: 10,
        stroke: theme.palette.success.main,
        fill: 'none',
        animation: `${stroke} 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards`,
    },
    '& .checkmark__check': {
        transformOrigin: '50% 50%',
        strokeDasharray: 48,
        strokeDashoffset: 48,
        animation: `${stroke} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards`,
    },
}));

export default AnimatedCheckmark;
