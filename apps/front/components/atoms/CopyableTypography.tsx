'use client';

import React, {useState, type FC, ComponentProps} from 'react';
import {Box, Typography, IconButton, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useTranslations} from 'next-intl';

interface CopyableTypographyProps extends ComponentProps<typeof Typography> {
    /**
     * The plain text value that will be copied when the user triggers the copy action.
     */
    text: string;
    /**
     * Optional children. If provided, these will be rendered as the visible content instead of the plain text.
     */
    children?: React.ReactNode;
}

const CopyableTypography: FC<CopyableTypographyProps> = ({
    text,
    children,
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
                    sx={{cursor: 'pointer', ...typographyProps.sx}}
                    onClick={handleCopy}
                >
                    {children || text}
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
