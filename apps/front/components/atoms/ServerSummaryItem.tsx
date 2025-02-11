'use client';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Fade, Tooltip, Button} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {ServerSummaryDto} from '@shared/dto';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {type FC, type ReactNode, useEffect, useMemo, useState} from 'react';
import {shortenText} from '@core';
import ServerCategoryMapper from '../consts/ServerCategoryMapper';
import {defaultServerIcon} from '../mocks/serverSummaryMocks';
import {useVerifyServer} from '../queries/servers/verifyServer';
import {useVoteForServer} from '../queries/servers/voteForServer';
import CopyableTypography from './CopyableTypography';
import {Link} from '@front/i18n/routing';

const StyledServerSummary = styled(Paper)(({theme}) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: '1fr 6fr 1fr',
    minWidth: 'min-content',
    gap: theme.spacing(1),
    position: 'relative',
}));

const IconContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const StyledServerIcon = styled(Image)(({theme}) => ({
    width: theme.spacing(10),
    height: theme.spacing(10),
    borderRadius: theme.shape.borderRadius,
}));

const StyledServerBanner = styled(Image)(() => ({
    width: '80%',
}));

const StyledNameAndRankingContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}));

const ServerDescription = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
}));

const StatsContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
}));

const CategoriesContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(0.5),
}));

const StyledCategoryIcon = styled(Avatar)(({theme}) => ({
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: '1rem',
}));

const InactiveOverlay = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(128,128,128,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.speedDial,
    borderRadius: theme.shape.borderRadius,
}));

type ServerSummaryProps = {
    server: ServerSummaryDto;
};

const ServerSummaryItem: FC<ServerSummaryProps> = ({server}) => {
    const t = useTranslations('page.list');
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(server.isLiked);
    const [votes, setVotes] = useState<number>(server.votes ?? 0);
    const {
        mutate: verifyServer,
        isSuccess: isServerVerified,
        isError: isVerificationError,
        error: verificationError,
    } = useVerifyServer();
    const {mutateAsync: voteForServer} = useVoteForServer();

    const handleFavoriteClick = () => {
        const newLiked = !isLikedByUser;
        setIsLikedByUser(newLiked);
        const delta = newLiked ? 1 : -1;

        setVotes(votes + delta);

        voteForServer(server.host)
            .then((serverVotes) => {
                if (serverVotes !== votes) {
                    setVotes(serverVotes);
                }
            })
            .catch((error) => {
                setVotes(votes - delta);
                dispatch(
                    addNotification({
                        id: server.id,
                        level: 'Error',
                        description: error.message,
                        title: error.name,
                    }),
                );
            });
    };

    const handleVerifyServer = () => {
        verifyServer(server);
    };

    useEffect(() => {
        if (isVerificationError) {
            dispatch(
                addNotification({
                    id: server.id,
                    level: 'Error',
                    description: verificationError.message,
                    title: verificationError.name,
                }),
            );
        }
    }, [isVerificationError]);

    const displayName = server.ip_address ? server.ip_address : server.host;
    const displayPort = server.port ? `:${server.port}` : '';
    const serverVersion = server.versions?.[0] ?? 'N/A';
    const onlinePlayers = server.onlinePlayers ?? 0;
    const maxPlayers = server.maxPlayers ?? 0;
    const categories = server.categories ?? [];
    const description = shortenText(server?.description ?? '', 320);
    const linkTo = `/${server.host}`;

    const LinkWrapper = ({children}: {children: ReactNode}) => (
        <Link
            prefetch={false}
            href={linkTo}
            onMouseEnter={() => router.prefetch(linkTo)}
            className="cursor-pointer"
        >
            {children}
        </Link>
    );

    const NotVerifiedOverlay = useMemo(() => {
        if (isServerVerified || server.isActive) {
            return <></>;
        }
        return (
            <InactiveOverlay>
                <Button variant="contained" onClick={handleVerifyServer}>
                    {t.rich('verify', {
                        code: () => (
                            <Typography variant="body2" ml={1}>
                                {server.verificationCode}
                            </Typography>
                        ),
                    })}
                </Button>
            </InactiveOverlay>
        );
    }, [server.isActive, isServerVerified]);

    return (
        <StyledServerSummary elevation={3}>
            <IconContainer>
                <LinkWrapper>
                    <StyledServerIcon
                        src={server.icon ?? defaultServerIcon}
                        alt="server icon"
                        width={50}
                        height={50}
                    />
                </LinkWrapper>
                <StyledNameAndRankingContainer>
                    <Typography variant="h6" color="textPrimary" noWrap>
                        {server.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textPrimary" noWrap>
                        #{server.ranking ?? 'n/a'}
                    </Typography>
                </StyledNameAndRankingContainer>
            </IconContainer>
            <ServerDescription>
                {server.banner && (
                    <LinkWrapper>
                        <StyledServerBanner
                            src={server.banner}
                            alt="server banner"
                            width="500"
                            height="60"
                        />
                    </LinkWrapper>
                )}
                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            display: '-webkit-box',
                            whiteSpace: 'pre-line',
                            WebkitLineClamp: server.banner ? 2 : 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </ServerDescription>
            <StatsContainer>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                >
                    <Box>
                        <CopyableTypography
                            variant="h6"
                            noWrap
                            text={`${displayName}${displayPort}`}
                        />
                        <Typography variant="subtitle1">
                            {t('playersOnline')} {onlinePlayers} / {maxPlayers}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" noWrap>
                            {t('version')} {serverVersion}
                        </Typography>
                    </Box>
                    <CategoriesContainer>
                        {categories.map((cat) => {
                            const config = ServerCategoryMapper[cat];
                            return (
                                <Tooltip
                                    key={cat}
                                    title={cat}
                                    arrow
                                    slots={{transition: Fade}}
                                    slotProps={{transition: {timeout: 500}}}
                                >
                                    <StyledCategoryIcon
                                        sx={{backgroundColor: config.color}}
                                    >
                                        {config.icon}
                                    </StyledCategoryIcon>
                                </Tooltip>
                            );
                        })}
                    </CategoriesContainer>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconButton onClick={handleFavoriteClick} size="small">
                        <FavoriteIcon sx={{color: isLikedByUser ? 'red' : 'grey'}} />
                    </IconButton>
                    <Typography variant="caption">{votes}</Typography>
                </Box>
            </StatsContainer>
            {NotVerifiedOverlay}
        </StyledServerSummary>
    );
};

export default ServerSummaryItem;
