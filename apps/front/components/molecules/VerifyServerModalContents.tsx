'use client';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useTranslations} from 'next-intl';
import {AxiosError} from 'axios';
import type {FC} from 'react';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import {useVerifyServer} from '@front/components/queries/servers/verifyServer';
import {ServerSummaryDto} from '@shared/dto';

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
}

const VerifyServerModalContents: FC<VerifyServerModalContentsProps> = ({server}) => {
    const t = useTranslations('server.add');
    const dispatch = useAppDispatch();

    const {mutateAsync: verifyServer} = useVerifyServer();

    const onStartVerification = () => {
        verifyServer(server).catch((error: AxiosError) => {
            console.error(error);
            dispatch(
                addNotification({
                    description: error.response.data['message'] ?? error.message,
                    id: `${error.status}`,
                    level: 'Error',
                    title: error.response.statusText,
                }),
            );
        });
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
