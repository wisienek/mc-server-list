'use client';

import {useTranslations} from 'next-intl';
import React, {useState} from 'react';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useAppSelector} from '../store/store';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from '@front/i18n/routing';
import {z} from 'zod';

const PageWrapper = styled(Container)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled('form')(({theme}) => ({
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
}));

const ButtonContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
}));

const credentialsSchema = z.object({
    password: z
        .string()
        .min(6, {message: 'Password must be at least 6 characters long.'}),
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export default function CredentialsPage() {
    const t = useTranslations();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [serverMessage, setServerMessage] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CredentialsFormData>({
        resolver: zodResolver(credentialsSchema),
        mode: 'onBlur',
    });

    const onSubmit: SubmitHandler<CredentialsFormData> = (data) => {
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/save-credentials`,
                {password: data.password},
                {withCredentials: true},
            )
            .then((response) => {
                if (response.status === 201) {
                    setServerMessage(t('profile.password.successfullySet'));
                    setTimeout(() => router.push('/'), 1_500);
                } else {
                    setServerMessage(response.data.message || t('genericError'));
                }
            })
            .catch((err) => {
                console.error('Error saving credentials:', err);
                setServerMessage(t('profile.password.credentialsSaveError'));
            });
    };

    if (!user) {
        return <></>;
    }

    return (
        <PageWrapper>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('profile.password.setCredentials')}
            </Typography>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="Email"
                    type="email"
                    value={user.email}
                    InputProps={{readOnly: true}}
                    fullWidth
                    variant="outlined"
                    disabled
                />
                <TextField
                    label={t('profile.password.password')}
                    type="password"
                    placeholder={t('profile.password.passwordPlaceholder')}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register('password')}
                />
                <ButtonContainer>
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/')}
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !!errors.password}
                    >
                        {isSubmitting
                            ? t('profile.password.saving')
                            : t('profile.password.save')}
                    </Button>
                </ButtonContainer>
            </FormContainer>

            {serverMessage && (
                <Typography variant="body1" color="info.main" align="center" mt={4}>
                    {serverMessage}
                </Typography>
            )}
        </PageWrapper>
    );
}
