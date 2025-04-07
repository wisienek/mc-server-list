'use client';
import {useTranslations} from 'next-intl';
import type {FC} from 'react';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import {useVerifyServer} from '@front/components/queries/servers/verifyServer';
import {ServerSummaryDto} from '@shared/dto';
import CircularProgress from '@mui/material/CircularProgress';

const StyledCode = styled('code')(({theme}) => ({
    wordBreak: 'normal',
    textColor: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
}));

interface VerifyServerModalContentsProps {
    server: ServerSummaryDto;
    handleClose: () => void;
}

const PendingIcon = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress size={20} thickness={5} />
        </Box>
    );
};

const VerifyServerModalContents: FC<VerifyServerModalContentsProps> = ({
    server,
    handleClose,
}) => {
    const t = useTranslations('server.add');

    const {mutateAsync: verifyServer, isPending} = useVerifyServer();

    const onStartVerification = async () => {
        const handled = await verifyServer(server);
        if (handled) {
            // TODO: add notification
            handleClose();
        }
    };

    return (
        <Box sx={{p: 4, textAlign: 'center'}}>
            <Typography variant="h5" gutterBottom color="textPrimary">
                {t('serverVerificationTitle')}
            </Typography>

            <CopyableTypography text={server?.verificationCode}>
                {t.rich('verificationInstructions', {
                    code: () => <StyledCode>{server?.verificationCode}</StyledCode>,
                })}
            </CopyableTypography>

            <Button
                variant="contained"
                color="primary"
                onClick={onStartVerification}
                disabled={isPending}
                endIcon={isPending ? <PendingIcon /> : null}
                sx={{mt: 3}}
            >
                <Typography variant="button" color="textPrimary">
                    {t('startVerification')}
                </Typography>
            </Button>
        </Box>
    );
};

export default VerifyServerModalContents;
