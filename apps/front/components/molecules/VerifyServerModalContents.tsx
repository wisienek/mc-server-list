'use client';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import axios, {AxiosError} from 'axios';
import {useLocale, useTranslations} from 'next-intl';
import type {FC} from 'react';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CopyableTypography from '@front/components/atoms/CopyableTypography';
import {CreateServerDto, CreateServerResponseDto, ServerDto} from '@shared/dto';

const StyledCode = styled('code')(({theme}) => ({
    wordBreak: 'normal',
    textColor: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
}));

interface VerifyServerModalContentsProps {
    serverResponse: CreateServerResponseDto;
    createData: CreateServerDto;
}

const VerifyServerModalContents: FC<VerifyServerModalContentsProps> = ({
    serverResponse,
    createData,
}) => {
    const t = useTranslations('server.add');
    const language = useLocale();
    const dispatch = useAppDispatch();

    const onStartVerification = () => {
        axios
            .post<ServerDto>(
                `${process.env.NEXT_PUBLIC_API_URL}/servers/${serverResponse.host}`,
                createData,
                {
                    withCredentials: true,
                },
            )
            .then((response) => {
                console.log(response);
            })
            .catch((error: AxiosError) => {
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
                {t('newServer')}
            </Typography>

            <CopyableTypography text={serverResponse.code}>
                {t.rich('verificationInstructions', {
                    code: () => <StyledCode>{serverResponse.code}</StyledCode>,
                })}
            </CopyableTypography>

            <Typography variant="subtitle1" gutterBottom color="textPrimary">
                {t.rich('expiresAt', {
                    expirationDate: () => (
                        <StyledCode>
                            {dayjs(serverResponse.expiresAt)
                                .locale(language)
                                .format('DD MMM YYYY, HH:mm')}
                        </StyledCode>
                    ),
                })}
            </Typography>

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
