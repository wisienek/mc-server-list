'use client';

import ServerDescriptionSection from '@front/components/molecules/ServerDescriptionSection';
import StyledPageContainer from '@front/components/atoms/StyledPageContainer';
import ServerMainInfo from '@front/components/molecules/ServerMainInfo';
import {ServerDetailsDto} from '@shared/dto';

type ServerDetailsProps = {
    server: ServerDetailsDto;
};

const ServerDetails = ({server}: ServerDetailsProps) => {
    return (
        <StyledPageContainer>
            <ServerMainInfo server={server} />
            <ServerDescriptionSection server={server} />
        </StyledPageContainer>
    );
};

export default ServerDetails;
