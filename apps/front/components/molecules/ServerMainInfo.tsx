'use client';
import SelectedCategoriesSummary from '@front/components/atoms/SelectedCategoriesSummary';
import {updateServerDetailsCommand} from '@front/components/queries/servers/updateServerDetails';
import ServerInfoContainer from '@front/components/atoms/ServerInfoContainer';
import {defaultServerIcon} from '@front/components/mocks/serverSummaryMocks';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import AddCategoriesModal from '@front/components/atoms/AddCategoriesModal';
import EditableTypography from '@front/components/atoms/EditableTypography';
import {useAppSelector} from '@lib/front/components/store/store';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import {omit} from 'lodash';
import Image from 'next/image';
import {useState} from 'react';
import {ServerCategory, ServerType} from '@shared/enums';
import {ServerDetailsDto} from '@shared/dto';

type ServerMainInfoProps = {
    server: ServerDetailsDto;
};

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

    const {mutateAsync: updateDetails} = updateServerDetailsCommand(server.host);
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
                <Typography variant="h6" color="textPrimary">
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
                <ServerInfoContainer
                    direction="row"
                    sx={{alignItems: 'center', padding: 0}}
                >
                    <Typography variant="subtitle1" color="textPrimary">
                        Ranking:
                    </Typography>
                    <Typography variant="body1" color="textSecondary" ml={1}>
                        #{server.ranking}
                    </Typography>
                </ServerInfoContainer>

                <ServerInfoContainer
                    direction="row"
                    sx={{alignItems: 'center', padding: 0}}
                >
                    <Typography variant="subtitle1" color="textPrimary">
                        Votes:
                    </Typography>
                    <Typography variant="body1" color="textSecondary" ml={1}>
                        {server.votes}
                    </Typography>
                </ServerInfoContainer>
            </IpSection>
        );
    };

    const EditingName = () => {
        const props = {
            variant: 'h5',
            fontWeight: server?.name ? 'bold' : 'normal',
            color: 'textPrimary',
            title: server?.name,
            placeholder: t('serverNamePlaceholder'),
            handleInputChange: (name: string) => {
                if (name.length < 3) {
                    return;
                }

                updateDetails({
                    name,
                }).then((details) => {
                    server.name = details.name;
                });
            },
        } as const;

        if (profile?.id !== server.owner_id) {
            return (
                <Typography
                    {...omit(props, ['title', 'placeholder', 'handleInputChange'])}
                >
                    {props?.title ?? server.host}
                </Typography>
            );
        }

        return <EditableTypography {...props} />;
    };

    return (
        <ServerInfoContainer direction="column">
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

            <ServerInfoContainer direction="row">
                <LeftSection>
                    <StyledServerIcon
                        src={serverIcon}
                        alt={server.name ?? 'server-icon'}
                        width={theme.spacing(10).replace('px', '')}
                        height={theme.spacing(10).replace('px', '')}
                    />

                    <IpSection>
                        <EditingName />
                        <IpAddresses />
                    </IpSection>
                </LeftSection>

                <ServerInfoContainer
                    direction="column"
                    usePadding={false}
                    sx={{justifyContent: 'center'}}
                >
                    <VersionList />
                    <PlayersOnline />
                </ServerInfoContainer>
            </ServerInfoContainer>

            <ServerInfoContainer
                direction="row"
                sx={{
                    [theme.breakpoints.down('md')]: {
                        padding: theme.spacing(0, 3),
                        flexDirection: 'column-reverse',
                    },
                }}
            >
                <CategoriesSection />
                <RankingSection />
            </ServerInfoContainer>
        </ServerInfoContainer>
    );
}
