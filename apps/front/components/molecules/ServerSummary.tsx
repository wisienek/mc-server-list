'use client';
import {Skeleton} from '@mui/material';
import {ServerSummaryDto} from '@shared/dto';
import React, {type FC} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import ServerSummaryItem from '../atoms/ServerSummaryItem';

const ServerSummaryListContainer = styled(Grid)(({theme}) => ({
    gap: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
}));

type ServerSummaryListProps = {
    isLoading: boolean;
    servers: ServerSummaryDto[];
    setShowVerificationModal: (server: ServerSummaryDto) => void;
};

export const ServerSummaryList: FC<ServerSummaryListProps> = ({
    servers,
    isLoading,
    setShowVerificationModal,
}) => {
    const ServerSummaryItems = () => {
        if (isLoading) {
            return new Array(10)
                .fill(null)
                .map((_, id) => (
                    <Skeleton
                        variant="rectangular"
                        key={`summary-loader-${id}`}
                        height={80}
                    />
                ));
        }

        return servers.map((server) => (
            <Grid key={server.id}>
                <ServerSummaryItem
                    server={server}
                    setShowVerificationModal={setShowVerificationModal}
                />
            </Grid>
        ));
    };

    return (
        <Box sx={{width: '100%', padding: 2}}>
            <ServerSummaryListContainer>
                <ServerSummaryItems />
            </ServerSummaryListContainer>
        </Box>
    );
};

export default ServerSummaryList;
