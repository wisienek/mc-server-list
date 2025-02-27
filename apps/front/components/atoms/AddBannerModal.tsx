'use client';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import {useState, type FC, type ChangeEvent} from 'react';

const StyledBox = styled(Box)(() => ({
    minWidth: '300px',
}));

type AddBannerModalProps = {
    open: boolean;
    addAction: (url: string) => void;
    handleClose: () => void;
};

const AddBannerModal: FC<AddBannerModalProps> = ({open, addAction, handleClose}) => {
    const t = useTranslations('page.hostPage.bannerModal');
    const [url, setUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    const allowedPattern =
        '^(https?:\\/\\/)?(i\\.)?imgur\\.com\\/.+\\.(jpg|jpeg|png|gif)$';
    const regex = new RegExp(allowedPattern, 'i');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setUrl(input);

        if (!regex.test(input)) {
            setError(t('invalidUrl'));
        } else {
            setError('');
        }
    };

    const handleSave = () => {
        if (!url || error) return;
        addAction(url);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="post-banner"
            aria-modal="true"
            open={open}
        >
            <StyledBox>
                <DialogTitle sx={{m: 0, p: 2}} id="post-banner">
                    {t('title')}
                </DialogTitle>

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.error.main,
                    })}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent dividers>
                    <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                    >
                        {t('description')}
                    </Typography>
                    <TextField
                        fullWidth
                        label={t('urlLabel')}
                        value={url}
                        onChange={handleChange}
                        error={!!error}
                        helperText={error}
                        slotProps={{htmlInput: {pattern: allowedPattern}}}
                    />
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleSave}>
                        {t('save')}
                    </Button>
                </DialogActions>
            </StyledBox>
        </Dialog>
    );
};

export default AddBannerModal;
