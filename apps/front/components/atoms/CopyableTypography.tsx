import {useTranslations} from 'next-intl';
import React, {useState, type FC, ComponentProps} from 'react';
import {Box, Typography, IconButton, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type CopyableTypographyProps = {
    text: string;
} & ComponentProps<typeof Typography>;

const CopyableTypography: FC<CopyableTypographyProps> = ({
    text,
    ...typographyProps
}) => {
    const t = useTranslations('copy');
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const tooltipTitle = copied ? t('copied') : t('label');

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Tooltip title={tooltipTitle} placement="top" arrow>
                <Typography
                    {...typographyProps}
                    sx={{cursor: 'pointer'}}
                    onClick={handleCopy}
                >
                    {text}
                </Typography>
            </Tooltip>
            <Tooltip title={tooltipTitle} placement="top" arrow>
                <IconButton onClick={handleCopy} size="small">
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default CopyableTypography;
