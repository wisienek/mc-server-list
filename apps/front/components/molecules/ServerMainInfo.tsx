import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import SelectedCategoriesSummary from '@front/components/atoms/SelectedCategoriesSummary';
import {defaultServerIcon} from '@front/components/mocks/serverSummaryMocks';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import {ServerDetailsDto} from '@shared/dto';

type ServerMainInfoProps = {
    server: ServerDetailsDto;
};

const Container = styled('div')(({theme}) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const LeftSection = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
});

const IpSection = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
}));

const StyledServerIcon = styled(Image)(({theme}) => ({
    height: '100%',
    width: 'auto',
    maxHeight: '100%',
    aspectRatio: 1,
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(5),
}));

export default function ServerMainInfo({server}: ServerMainInfoProps) {
    const serverIcon = server.icon || defaultServerIcon;
    const theme = useTheme();

    // TODO: determine if main type is bedrock/java and add a connected server of other type.
    const IpAddresses = () => {
        return (
            <>
                <CopyableTypography
                    text={server.host ?? server.ip_address}
                    showCopyIcon={false}
                    variant="body1"
                    color="textSecondary"
                >
                    Java IP: <strong>{server.host ?? server.ip_address}</strong>
                </CopyableTypography>

                <Typography variant="body1" color="textSecondary">
                    Bedrock IP: <strong>...</strong>
                </Typography>
            </>
        );
    };

    return (
        <Container>
            <LeftSection>
                <StyledServerIcon
                    src={serverIcon}
                    alt={server.name}
                    width={theme.spacing(10).replace('px', '')}
                    height={theme.spacing(10).replace('px', '')}
                />

                <IpSection>
                    <Typography variant="h4" fontWeight="bold" color="textPrimary">
                        {server.name}
                    </Typography>

                    <IpAddresses />
                </IpSection>
            </LeftSection>

            <IpSection>
                <Typography variant="h6" color="textSecondary">
                    Server Categories
                </Typography>
                <SelectedCategoriesSummary
                    selectedCategories={server.categories}
                    iconProps={{
                        sx: {
                            borderRadius: theme.spacing(1),
                            width: theme.spacing(4),
                            height: theme.spacing(4),
                            fontSize: theme.spacing(4),
                        },
                    }}
                />
            </IpSection>
        </Container>
    );
}
