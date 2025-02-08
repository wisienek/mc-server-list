import React from 'react';
import {styled, keyframes} from '@mui/material/styles';

const dynamicRotation = keyframes`
  0% {
    transform: rotate(0deg);
    animation-timing-function: ease-out;
  }
  100% {
    transform: rotate(360deg);
    animation-timing-function: ease-in;
  }
`;

const LogoContainer = styled('div')({
    display: 'inline-block',
});

interface StyledSVGProps {
    rotate: boolean;
}

const StyledSVG = styled('svg', {shouldForwardProp: (name) => name !== 'rotate'})<
    StyledSVGProps & {rotate: boolean}
>(({rotate}) => ({
    transformOrigin: '50% 50%',
    ...(rotate
        ? {
              animation: `${dynamicRotation} 0.8s infinite`,
          }
        : {}),
}));

type DynamicRotatingDiscordLogoProps = {
    width?: number;
    height?: number;
    discordColor?: string;
    discordFill?: string;
    rotate?: boolean;
};

const DynamicRotatingDiscordLogo: React.FC<DynamicRotatingDiscordLogoProps> = ({
    width = 101,
    height = 101,
    discordColor = '#7289DA',
    discordFill = '#2C2F33',
    rotate = false,
}) => {
    return (
        <LogoContainer>
            <StyledSVG
                rotate={rotate}
                color={discordColor}
                fill={discordFill}
                width={width}
                height={height}
                viewBox="0 0 48 48"
            >
                {/* Background rectangle */}
                <rect width="100%" height="100%" fill="currentfill" />
                <defs>
                    <path
                        id="discord-def-face"
                        fill="currentcolor"
                        d="M40,12C40,12,35.415,8.412,30,8L29.512,8.976C34.408,10.174,36.654,11.891,39,14C34.955,11.935,30.961,10,24,10S13.045,11.935,9,14C11.346,11.891,14.018,9.985,18.488,8.976L18,8C12.319,8.537,8,12,8,12S2.879,19.425,2,34C7.162,39.953,15,40,15,40L16.639,37.815C13.857,36.848,10.715,35.121,8,32C11.238,34.45,16.125,37,24,37S36.762,34.45,40,32C37.285,35.121,34.143,36.848,31.361,37.815L33,40C33,40,40.838,39.953,46,34C45.121,19.425,40,12,40,12Z"
                    />
                    <g id="discord-def-face-eyes">
                        <path
                            id="discord-def-face-left-eye"
                            fill="currentfill"
                            d="M17.5,30C15.567,30,14,28.209,14,26C14,23.791,15.567,22,17.5,22S21,23.791,21,26C21,28.209,19.433,30,17.5,30Z"
                        />
                        <path
                            id="discord-def-face-right-eye"
                            fill="currentfill"
                            d="M30.5,30C28.567,30,27,28.209,27,26C27,23.791,28.567,22,30.5,22S34,23.791,34,26C34,28.209,32.433,30,30.5,30Z"
                        />
                    </g>
                </defs>
                <g className="discord-logo">
                    <use xlinkHref="#discord-def-face" />
                    <use xlinkHref="#discord-def-face-eyes" />
                </g>
            </StyledSVG>
        </LogoContainer>
    );
};

export default DynamicRotatingDiscordLogo;
