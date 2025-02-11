'use client';
import {ListServersDto} from '@shared/dto';
import {useState} from 'react';
import StyledPageContainer from '../atoms/StyledPageContainer';
import ServerFilters from '../molecules/ServerFilters';
import ServerSummaryList from '../molecules/ServerSummary';
import {serverListQuery} from '../queries/servers/serverListQuery';

const ServerListPage = () => {
    const [searchData, setSearchData] = useState<ListServersDto>({isOwn: false});
    const {isLoading, data: fetchedServers} = serverListQuery(searchData);

    return (
        <StyledPageContainer>
            <ServerFilters setSearchData={setSearchData} />
            <ServerSummaryList
                servers={fetchedServers?.items}
                isLoading={isLoading}
            />
        </StyledPageContainer>
    );
};

export default ServerListPage;
