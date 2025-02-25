import SelectedCategoriesSummary from '@front/components/atoms/SelectedCategoriesSummary';
import {defaultServerIcon} from '@front/components/mocks/serverSummaryMocks';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import {useAppSelector} from '@lib/front/components/store/store';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {useTheme} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {ServerDetailsDto} from '@shared/dto';
import {ServerCategory, ServerType} from '@shared/enums';
import {useState} from 'react';
import AddCategoriesModal from '../atoms/AddCategoriesModal';
import {updateServerDetails} from '../queries/servers/updateServerDetails';

type ServerMainInfoProps = {
    server: ServerDetailsDto;
};

const Container = styled(Grid, {
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

const LeftSection = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
});

const IpSection = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
}));

const StyledServerIcon = styled(Image)(({theme}) => ({
    // height: '100%',
    width: 'auto',
    maxHeight: '100%',
    aspectRatio: 1,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

export default function ServerMainInfo({server}: ServerMainInfoProps) {
    const t = useTranslations('page.hostPage');

    const {mutateAsync: updateDetails} = updateServerDetails(server.host);
    const profile = useAppSelector((store) => store.auth.user);
    const [showingAddCategoryModal, setShowingAddCategoryModal] =
        useState<boolean>(false);

    const theme = useTheme();

    const serverIcon = server.icon || defaultServerIcon;

    // TODO: determine if main type is bedrock/java and add a connected server of other type.
    const IpAddresses = () => {
        return (
            <LeftSection>
                <Typography variant="subtitle1" color="textPrimary">
                    {server.type === ServerType.JAVA ? t('javaIP') : t('bedrockIP')}:
                </Typography>
                <CopyableTypography
                    text={server.host ?? server.ip_address}
                    showCopyIcon={false}
                    variant="body1"
                    color="textSecondary"
                >
                    {server.host ?? server.ip_address}
                </CopyableTypography>

                {/*<Typography variant="body1" color="textSecondary">*/}
                {/*    {t('bedrockIP')}: <strong>...</strong>*/}
                {/*</Typography>*/}
            </LeftSection>
        );
    };

    const VersionList = () => {
        return (
            <LeftSection>
                <Typography variant="subtitle1" color="textPrimary">
                    {t('versions', {length: server.versions.length})}:
                </Typography>

                {server.versions.map((v) => (
                    <Typography key={`v-${v}`} variant="body1" color="textSecondary">
                        {v}
                    </Typography>
                ))}
            </LeftSection>
        );
    };

    const PlayersOnline = () => {
        return (
            <LeftSection>
                <Typography variant="subtitle1" color="textPrimary">
                    {t('playersOnline')}:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    {server.onlinePlayers} / {server.maxPlayers}
                </Typography>
            </LeftSection>
        );
    };

    const CategoriesSection = () => {
        return (
            <IpSection>
                <Typography variant="h6" color="textSecondary">
                    {t('serverCategories')}:
                </Typography>
                <SelectedCategoriesSummary
                    showAddIcon={server.owner_id === profile?.id}
                    selectedCategories={server.categories}
                    addIconAction={() => setShowingAddCategoryModal(true)}
                    removeIconAction={(category) =>
                        updateDetails({
                            categories: server.categories.filter(
                                (c) => c !== category,
                            ),
                        }).then(
                            (details) => (server.categories = details.categories),
                        )
                    }
                    bodyProps={{
                        sx: {
                            gap: theme.spacing(3),
                        },
                    }}
                    iconProps={{
                        sx: {
                            borderRadius: theme.spacing(1),
                            width: theme.spacing(4),
                            height: theme.spacing(4),
                            fontSize: theme.spacing(4),
                        },
                    }}
                />
            </IpSection>
        );
    };

    const RankingSection = () => {
        return (
            <IpSection>
                <Container direction="row" sx={{alignItems: 'center', padding: 0}}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Ranking:
                    </Typography>
                    <Typography variant="body1" color="textSecondary" ml={1}>
                        #{server.ranking}
                    </Typography>
                </Container>

                <Container direction="row" sx={{alignItems: 'center', padding: 0}}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Votes:
                    </Typography>
                    <Typography variant="body1" color="textSecondary" ml={1}>
                        {server.votes}
                    </Typography>
                </Container>
            </IpSection>
        );
    };

    return (
        <Container direction="column">
            <AddCategoriesModal
                server={server}
                open={showingAddCategoryModal}
                addAction={(categories: ServerCategory[]) =>
                    updateDetails({
                        categories: [
                            ...new Set([...categories, ...server.categories]),
                        ],
                    }).then((details) => {
                        server.categories = details.categories;
                    })
                }
                handleClose={() => setShowingAddCategoryModal(false)}
            />

            <Container direction="row">
                <LeftSection>
                    <StyledServerIcon
                        src={serverIcon}
                        alt={server.name}
                        width={theme.spacing(10).replace('px', '')}
                        height={theme.spacing(10).replace('px', '')}
                    />

                    <IpSection>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="textPrimary"
                        >
                            {server.name}
                        </Typography>

                        <IpAddresses />
                    </IpSection>
                </LeftSection>

                <Container
                    direction="column"
                    usePadding={false}
                    sx={{justifyContent: 'center'}}
                >
                    <VersionList />
                    <PlayersOnline />
                </Container>
            </Container>

            <Container direction="row">
                <CategoriesSection />
                <RankingSection />
            </Container>
        </Container>
    );
}
