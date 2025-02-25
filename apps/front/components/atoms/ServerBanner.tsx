'use client';

import {styled} from '@mui/material/styles';
import Image from 'next/image';

type ServerBannerProps = {
    bannerURL?: string;
};

const BannerContainer = styled('div')(({theme}) => ({
    width: '90%',
    maxWidth: '95%',
    margin: `${theme.spacing(4)} auto`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    aspectRatio: '5 / 2',
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
}));

const StyledImage = styled(Image)({
    objectFit: 'cover',
});

const ServerBanner = ({bannerURL}: ServerBannerProps) => {
    if (!bannerURL) return null;

    return (
        <BannerContainer>
            <StyledImage src={bannerURL} alt="Server Banner" fill />
        </BannerContainer>
    );
};

export default ServerBanner;
