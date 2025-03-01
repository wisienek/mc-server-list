'use client';

import ServerDescriptionSection from '@front/components/molecules/ServerDescriptionSection';
import StyledPageContainer from '@front/components/atoms/StyledPageContainer';
import ServerMainInfo from '@front/components/molecules/ServerMainInfo';
import ServerBanner from '@front/components/atoms/ServerBanner';
import {ServerDetailsDto} from '@shared/dto';
import ServerSRVRecordSection from '../molecules/ServerSRVRecordSection';

type ServerDetailsProps = {
    server: ServerDetailsDto;
};

const ServerDetails = ({server}: ServerDetailsProps) => {
    return (
        <StyledPageContainer>
            <ServerMainInfo server={server} />
            <ServerBanner server={server} />
            <ServerDescriptionSection server={server} />
            <ServerSRVRecordSection server={server} />
        </StyledPageContainer>
    );
};

export default ServerDetails;
