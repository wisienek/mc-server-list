'use client';

import React, {useState, type FC, type ComponentProps} from 'react';
import {useTranslations} from 'next-intl';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

interface CopyableTypographyProps extends ComponentProps<typeof Typography> {
    /**
     * Flag to show copy icon - optional, default set to true
     */
    showCopyIcon?: boolean;
    /**
     * The plain text value that will be copied when the user triggers the copy action.
     */
    text: string;
    /**
     * Optional children. If provided, these will be rendered as the visible content instead of the plain text.
     */
    children?: React.ReactNode;
}

const BoxWrapper = ({children}: Pick<CopyableTypographyProps, 'children'>) => {
    return <Box sx={{display: 'flex', alignItems: 'center'}}>{children}</Box>;
};

const CopyableTypography: FC<CopyableTypographyProps> = ({
    text,
    showCopyIcon = true,
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

    const PrimaryText = () => {
        return (
            <Tooltip title={tooltipTitle} placement="top" arrow>
                <Typography
                    sx={{cursor: 'pointer', ...typographyProps.sx}}
                    onClick={handleCopy}
                    color="textPrimary"
                    {...typographyProps}
                >
                    {children || text}
                </Typography>
            </Tooltip>
        );
    };

    const CopyButtonWithTooltip = () => {
        return (
            <Tooltip title={tooltipTitle} placement="top" arrow>
                <IconButton onClick={handleCopy} size="small">
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        );
    };

    if (!showCopyIcon) {
        return <PrimaryText />;
    }

    return (
        <BoxWrapper>
            <PrimaryText />
            <CopyButtonWithTooltip />
        </BoxWrapper>
    );
};

export default CopyableTypography;
