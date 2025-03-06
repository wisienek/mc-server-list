import {type UseQueryResult} from '@tanstack/react-query';
import React, {type FC} from 'react';
import Skeleton from '@mui/material/Skeleton';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import PaginationWrapped from '@front/components/atoms/PaginationWrapped';
import ServerSummaryItem from '@front/components/atoms/ServerSummaryItem';
import {Pagination, ServerSummaryDto} from '@shared/dto';
import type {ServerPaginatedListWithMDXSource} from '../queries/servers/serverListQuery';

const ServerSummaryListContainer = styled(Grid)(({theme}) => ({
    gap: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
}));

type ServerSummaryListProps = {
    setShowVerificationModal: (server: ServerSummaryDto) => void;
    fetchServersQuery: UseQueryResult<Pagination<ServerPaginatedListWithMDXSource>>;
};

type ServerSummaryAwaitedProps = {
    fetchedServers: UseQueryResult<Pagination<ServerPaginatedListWithMDXSource>>;
} & Pick<ServerSummaryListProps, 'setShowVerificationModal'>;

const ServerSummaryAwaited: FC<ServerSummaryAwaitedProps> = ({
    fetchedServers,
    setShowVerificationModal,
}) => {
    const data = fetchedServers.data;

    const PaginationInputs = () => {
        return (
            data.items.length > 0 && (
                <PaginationWrapped
                    items={data.items}
                    currentPage={data.currentPage}
                    pages={data.totalPages}
                    totalItems={data.total}
                    setCurrentPage={() => {}}
                />
            )
        );
    };

    return (
        <>
            <PaginationInputs />

            {data.items.map((server) => (
                <Grid key={server.id}>
                    <ServerSummaryItem
                        server={server}
                        setShowVerificationModal={setShowVerificationModal}
                    />
                </Grid>
            ))}

            <PaginationInputs />
        </>
    );
};

const ServerSummaryList: FC<ServerSummaryListProps> = ({
    fetchServersQuery,
    setShowVerificationModal,
}) => {
    const ServerData = () => {
        if (fetchServersQuery.isLoading) {
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

        return (
            <ServerSummaryAwaited
                fetchedServers={fetchServersQuery}
                setShowVerificationModal={setShowVerificationModal}
            />
        );
    };

    return (
        <Box sx={{width: '100%', padding: 2}}>
            <ServerSummaryListContainer>
                <ServerData />
            </ServerSummaryListContainer>
        </Box>
    );
};

export default ServerSummaryList;
