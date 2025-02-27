'use client';

import {updateServerDetails} from '@front/components/queries/servers/updateServerDetails';
import {useAppSelector} from '@lib/front/components/store/store';
import Typography from '@mui/material/Typography';
import {darken, styled} from '@mui/material/styles';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {ServerDetailsDto} from '@shared/dto';
import {useState} from 'react';
import AddBannerModal from './AddBannerModal';

type ServerBannerProps = {
    server: ServerDetailsDto;
};

const BannerContainer = styled('div')(({theme}) => ({
    width: '90%',
    maxWidth: '95%',
    margin: `${theme.spacing(4)} auto`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    aspectRatio: '5 / 1',
    overflow: 'hidden',
    borderRadius: theme.spacing(1 / 2),
    cursor: 'pointer',
    backgroundColor: darken(theme.palette.background.paper, 1 / 8),
}));

const StyledImage = styled(Image)({
    objectFit: 'fill',
});

const ServerBanner = ({server}: ServerBannerProps) => {
    const profile = useAppSelector((store) => store.auth.user);
    const {mutateAsync: updateDetails} = updateServerDetails(server.host);
    const t = useTranslations('page.hostPage');
    const [isBannerOpen, setIsBannerOpen] = useState<boolean>(false);

    const isOwner = server.owner_id === profile?.id;
    if (!server.banner && !isOwner) {
        return null;
    }

    const openBanner = () => {
        console.log(isOwner, isBannerOpen);
        if (isOwner) {
            setIsBannerOpen(true);
        }
    };

    const InnerBanner = () => {
        if (server.banner) {
            return (
                <StyledImage
                    unoptimized
                    loader={() => server.banner}
                    src={server.banner}
                    alt="Server Banner"
                    fill
                />
            );
        }

        return (
            <Typography variant="h4" color="textSecondary">
                {t('addBanner')}
            </Typography>
        );
    };

    return (
        <>
            <AddBannerModal
                open={isBannerOpen}
                addAction={(banner) => {
                    updateDetails({banner}).then((details) => {
                        server.banner = details.banner;
                    });
                }}
                handleClose={() => setIsBannerOpen(false)}
            />

            <BannerContainer onClick={openBanner}>
                <InnerBanner />
            </BannerContainer>
        </>
    );
};

export default ServerBanner;
