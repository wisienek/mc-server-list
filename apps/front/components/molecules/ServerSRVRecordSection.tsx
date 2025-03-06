'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import {styled} from '@mui/material/styles';
import type {ServerDetailsDto} from '@shared/dto';
import {useTranslations} from 'next-intl';
import {type FC} from 'react';
import ServerInfoContainer from '@front/components/atoms/ServerInfoContainer';
import SrvRecordTable from '@front/components/atoms/SrvRecordTable';

const StyledAccordion = styled(Accordion)(({theme}) => ({
    borderRadius: `${theme.spacing(1 / 2)} !important`,
    marginBottom: theme.spacing(2),

    '& .MuiAccordionSummary-expandIconWrapper svg': {
        fill: theme.palette.primary.main,
    },
}));

type ServerSRVRecordSectionProps = {
    server: ServerDetailsDto;
};

const ServerSRVRecordSection: FC<ServerSRVRecordSectionProps> = ({server}) => {
    const t = useTranslations('page.hostPage');

    const data = {
        id: server.id,
        retrieved_at: server.retrieved_at,
        expires_at: server.expires_at,
        ...server.srv_record,
    };

    if (Object.keys(data).length === 0) {
        return null;
    }

    return (
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
                    <SrvRecordTable srvRecord={data} />
                </AccordionDetails>
            </StyledAccordion>
        </ServerInfoContainer>
    );
};

export default ServerSRVRecordSection;
