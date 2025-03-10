'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {useUserLogin} from '@front/components/queries/user/userLogin';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {closeModal} from '@lib/front/components/store/modalSlice';
import {useAppDispatch} from '@lib/front/components/store/store';

type LoginFormInputs = {
    email: string;
    password: string;
};

const useLoginSchema = () => {
    const t = useTranslations('profile.loginModal');

    return z.object({
        email: z.string().email({message: t('invalidEmail')}),
        password: z.string().min(6, {message: t('invalidPassword')}),
    });
};

const LoginModal = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations('profile.loginModal');
    const schema = useLoginSchema();
    const {mutateAsync: sendLoginRequest} = useUserLogin();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormInputs) => {
        const loggedInAs = await sendLoginRequest(data);

        dispatch(closeModal());
        dispatch(
            addNotification({
                id: `logged-in`,
                level: 'Success',
                title: t('loginNotification.title'),
                description: t('loginNotification.description', {
                    email: loggedInAs.email,
                }),
            }),
        );
    };

    return (
        <Dialog
            onClose={() => dispatch(closeModal())}
            open={true}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>{t('title')}</DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FormControl>
                        <TextField
                            {...register('email')}
                            label={t('email')}
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField
                            {...register('password')}
                            label={t('password')}
                            type="password"
                            variant="outlined"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button color="secondary" onClick={() => dispatch(closeModal())}>
                    {t('cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                >
                    {t('submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginModal;
