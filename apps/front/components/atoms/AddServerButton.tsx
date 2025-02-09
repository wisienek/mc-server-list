'use client';

import {useTranslations} from 'next-intl';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {styled} from '@mui/material/styles';
import type {FC} from 'react';

const StyledButton = styled(Button)(() => ({}));

type CreateServerButtonProps = {
    handleOpen: () => void;
};

const CreateServerButton: FC<CreateServerButtonProps> = ({
    handleOpen,
}: CreateServerButtonProps) => {
    const t = useTranslations('server.add');

    return (
        <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
        >
            {t('newServer')}
        </StyledButton>
    );
};

export default CreateServerButton;
