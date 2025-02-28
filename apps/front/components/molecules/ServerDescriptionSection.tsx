'use client';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import ServerInfoContainer from '@front/components/atoms/ServerInfoContainer';
import SrvRecordTable from '@front/components/atoms/SrvRecordTable';
import {ServerDetailsDto} from '@shared/dto';
import {useTranslations} from 'next-intl';

const StyledAccordion = styled(Accordion)(({theme}) => ({
    borderRadius: `${theme.spacing(1 / 2)} !important`,
    marginBottom: theme.spacing(2),

    '& .MuiAccordionSummary-expandIconWrapper svg': {
        fill: theme.palette.primary.main,
    },
}));

const StyledServerDescriptionContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
}));

type ServerDescriptionSectionProps = {
    server: ServerDetailsDto;
};

const ServerDescriptionSection = ({server}: ServerDescriptionSectionProps) => {
    const t = useTranslations('page.hostPage');

    return (
        <StyledServerDescriptionContainer>
            <ServerInfoContainer direction="column">
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    {t('description')}
                </Typography>

                {server.description ? (
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {server.description}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        {t('noDescription')}
                    </Typography>
                )}
            </ServerInfoContainer>

            {server.srv_record && (
                <ServerInfoContainer direction="column">
                    <StyledAccordion slotProps={{transition: {unmountOnExit: true}}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id="srv-header"
                            aria-controls="srv-content"
                        >
                            <Typography variant="h6" color="textPrimary">
                                {t('srvRecord')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SrvRecordTable
                                srvRecord={{
                                    id: server.id,
                                    retrieved_at: server.retrieved_at,
                                    expires_at: server.expires_at,
                                    ...server.srv_record,
                                }}
                            />
                        </AccordionDetails>
                    </StyledAccordion>
                </ServerInfoContainer>
            )}
        </StyledServerDescriptionContainer>
    );
};

export default ServerDescriptionSection;
