'use client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Fade, Tooltip} from '@mui/material';
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
import {type FC, type ReactNode, useState} from 'react';
import {shortenText} from '@core';
import ServerCategoryMapper from '../consts/ServerCategoryMapper';
import {defaultServerBanner, defaultServerIcon} from '../mocks/serverSummaryMocks';
import CopyableTypography from './CopyableTypography';
import {Link} from '@front/i18n/routing';

const StyledServerSummary = styled(Paper)(({theme}) => ({
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'grid',
    gridTemplateColumns: '1fr 6fr 1fr',
    minWidth: 'min-content',
    gap: theme.spacing(1),
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

type ServerSummaryProps = {
    server: ServerSummaryDto;
    onToggleFavorite?: (serverId: string) => void;
};

const ServerSummaryItem: FC<ServerSummaryProps> = ({server, onToggleFavorite}) => {
    const t = useTranslations('page.list');
    const router = useRouter();
    const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false);
    const [votes, setVotes] = useState<number>(server.votes ?? 0);

    const handleFavoriteClick = () => {
        const newLiked = !isLikedByUser;
        setIsLikedByUser(newLiked);
        setVotes((prev) => prev + (newLiked ? 1 : -1));
        if (onToggleFavorite) {
            onToggleFavorite(server.id);
        }
    };

    const displayName = server.ip_address ? server.ip_address : server.host;
    const displayPort = server.port ? `:${server.port}` : '';
    const serverVersion = server.versions?.[0] ?? 'N/A';
    const onlinePlayers = server.onlinePlayers ?? 0;
    const maxPlayers = server.maxPlayers ?? 0;
    const categories = server.categories ?? [];

    const description = shortenText(server?.description ?? '', 320);

    const linkTo = `/${server.host}`;

    const LinkWrapper = ({children}: {children: ReactNode}) => {
        return (
            <Link
                prefetch={false}
                href={linkTo}
                onMouseEnter={() => router.prefetch(linkTo)}
                className="cursor-pointer"
            >
                {children}
            </Link>
        );
    };

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
                                    slots={{
                                        transition: Fade,
                                    }}
                                    slotProps={{
                                        transition: {timeout: 500},
                                    }}
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
        </StyledServerSummary>
    );
};

export default ServerSummaryItem;
