'use client';
import StyledPageContainer from '../atoms/StyledPageContainer';
import serverSummaryMocks from '../mocks/serverSummaryMocks';
import ServerFilters from '../molecules/ServerFilters';
import ServerSummaryList from '../molecules/ServerSummary';

const ServerListPage = () => {
    return (
        <StyledPageContainer>
            <ServerFilters />
            <ServerSummaryList servers={serverSummaryMocks} />
        </StyledPageContainer>
    );
};

export default ServerListPage;
