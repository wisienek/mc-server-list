import {styled} from '@mui/material/styles';
import {ServerDetailsDto} from '@shared/dto';

const StyledServerDescriptionContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

type ServerDescriptionSectionProps = {
    server: ServerDetailsDto;
};

const ServerDescriptionSection = ({server}: ServerDescriptionSectionProps) => {
    return (
        <StyledServerDescriptionContainer>
            {JSON.stringify(server)}
            {/* Video */}
            {/* Description */}
            {/* Banner */}
            {/* Server info */}
            {/* Debug info */}
            {/* Reviews ??? */}
        </StyledServerDescriptionContainer>
    );
};

export default ServerDescriptionSection;
