'use client';

import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {AxiosError} from 'axios';
import {z} from 'zod';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import {zodResolver} from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import {useTranslations} from 'next-intl';
import {CreateServerDto, CreateServerResponseDto} from '@shared/dto';
import {hostnameRegex, ipv4Regex} from '@core';
import {ServerType} from '@shared/enums';
import ServerTypeOption from '@front/components/atoms/ServerTypeOption';
import {useCreateServer} from '../queries/servers/createServer';

const FormContainer = styled('form')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const ButtonContainer = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
}));

const NonWrappingButton = styled(Button)(() => ({
    whiteSpace: 'normal',
    wordBreak: 'normal',
    overflowWrap: 'normal',
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
    marginBottom: theme.spacing(2),
}));

const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: `1px solid ${theme.palette.primary.dark}`,
    },
}));

export type CreateServerFormData = {
    address: string;
    port: number;
    serverType: ServerType;
};

interface CreateServerModalContentsProps {
    handleClose: () => void;
    setServerResponse: (data: CreateServerResponseDto) => void;
    setCreateDto: (data: CreateServerDto) => void;
}

const CreateServerModalContents = ({
    handleClose,
    setServerResponse,
}: CreateServerModalContentsProps) => {
    const t = useTranslations('server.add');
    const dispatch = useAppDispatch();

    const {mutateAsync: sendCreateServer, isPending} = useCreateServer();

    const createServerSchema = z.object({
        address: z
            .string()
            .min(1, {message: t('addressRequired')})
            .refine((val) => ipv4Regex.test(val) || hostnameRegex.test(val), {
                message: t('invalidAddress'),
            }),
        port: z
            .number({invalid_type_error: t('portRequired')})
            .min(1, {message: t('portMin')})
            .max(65535, {message: t('portMax')}),
        serverType: z.nativeEnum(ServerType).default(ServerType.JAVA),
    });

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
        watch,
    } = useForm<CreateServerFormData>({
        resolver: zodResolver(createServerSchema),
        defaultValues: {
            address: '',
            port: 25565,
            serverType: ServerType.JAVA,
        },
    });

    const serverType = watch('serverType');

    const handleServerTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: ServerType | null,
    ) => {
        if (newType !== null) {
            setValue('serverType', newType);
        }
    };

    const isSubmitDisabled = isSubmitting || Object.keys(errors).length > 0;

    const onSubmit: SubmitHandler<CreateServerFormData> = (data) => {
        const pushData: CreateServerDto = {
            type: data.serverType,
            port: data.port,
        };

        if (ipv4Regex.test(data.address)) {
            pushData.ip = data.address;
        } else if (hostnameRegex.test(data.address)) {
            pushData.hostname = data.address;
        }

        sendCreateServer(pushData)
            .then((data) => {
                setServerResponse(data);
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
        <>
            <Typography variant="h5" component="h2" gutterBottom color="textPrimary">
                {t('title')}
            </Typography>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label={t('hostName')}
                    fullWidth
                    margin="normal"
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                />

                <TextField
                    label={t('port')}
                    fullWidth
                    margin="normal"
                    type="number"
                    {...register('port', {valueAsNumber: true})}
                    error={!!errors.port}
                    helperText={errors.port?.message}
                />

                <Typography variant="subtitle1" color="textPrimary">
                    {t('type')}
                </Typography>

                <StyledToggleButtonGroup
                    value={serverType}
                    exclusive
                    onChange={handleServerTypeChange}
                    sx={{mb: 2}}
                >
                    <StyledToggleButton value={ServerType.JAVA}>
                        <ServerTypeOption type={ServerType.JAVA} />
                    </StyledToggleButton>
                    <StyledToggleButton value={ServerType.BEDROCK}>
                        <ServerTypeOption type={ServerType.BEDROCK} />
                    </StyledToggleButton>
                </StyledToggleButtonGroup>

                <ButtonContainer>
                    <NonWrappingButton
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        {t('cancel')}
                    </NonWrappingButton>
                    <NonWrappingButton
                        type="submit"
                        variant="contained"
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitting ? t('isSubmitting') : t('save')}
                    </NonWrappingButton>
                </ButtonContainer>
            </FormContainer>
        </>
    );
};

export default CreateServerModalContents;
