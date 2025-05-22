'use client';
import Box from '@mui/material/Box';
import {styled, Theme, useTheme} from '@mui/material/styles';
import type {CSSProperties, ReactElement} from 'react';

type MinecraftMotdProps = {
    motd: string;
    motdHtml?: string;
    background: boolean;
};

type FormattingCode = string;

const styleMap: Record<FormattingCode, CSSProperties> = {
    l: {fontWeight: 'bold'},
    m: {textDecoration: 'line-through'},
    n: {textDecoration: 'underline'},
    o: {fontStyle: 'italic'},
    r: {fontWeight: 'normal', textDecoration: 'none', fontStyle: 'normal'},
};

const getColorMap = (theme: Theme): Record<FormattingCode, string> => ({
    '0': theme.palette.common.black,
    '1': '#0000AA',
    '2': '#00AA00',
    '3': '#00AAAA',
    '4': '#AA0000',
    '5': '#AA00AA',
    '6': '#FFAA00',
    '7': '#AAAAAA',
    '8': '#555555',
    '9': '#5555FF',
    a: '#55FF55',
    b: '#55FFFF',
    c: '#FF5555',
    d: '#FF55FF',
    e: '#FFFF55',
    f: theme.palette.common.white,
    r: theme.palette.text.primary,
});

const MotdContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'background',
})<{background: boolean}>(({theme, background}) => ({
    backgroundColor: background
        ? theme.palette.common.black
        : theme.palette.background.default,
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    borderRadius: theme.spacing(0.15),
    overflowX: 'auto',
    color: theme.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxWidth: '100%',
}));

function parseMotd(
    motd: string,
    colorMap: Record<FormattingCode, string>,
): ReactElement[] {
    const result: ReactElement[] = [];
    let i = 0;
    let currentStyle: CSSProperties = {};

    while (i < motd.length) {
        if (motd[i] === '§' && i + 1 < motd.length) {
            const code = motd[i + 1].toLowerCase();
            i += 2;

            if (code in colorMap) {
                currentStyle = {...currentStyle, color: colorMap[code]};
            } else if (code in styleMap) {
                currentStyle = {...currentStyle, ...styleMap[code]};
            }
            continue;
        }

        let text = '';
        while (i < motd.length && motd[i] !== '§') {
            text += motd[i];
            i++;
        }

        if (text) {
            result.push(
                <span style={{...currentStyle}} key={result.length}>
                    {text}
                </span>,
            );
        }
    }

    return result;
}

export default function MinecraftMotd({
    motd,
    motdHtml,
    background,
}: MinecraftMotdProps): ReactElement {
    const theme = useTheme();
    const colorMap = getColorMap(theme);

    if (motdHtml) {
        return (
            <MotdContainer
                background={background}
                dangerouslySetInnerHTML={{__html: motdHtml}}
            ></MotdContainer>
        );
    }

    const parsedMotd = parseMotd(motd, colorMap);
    return <MotdContainer background={background}>{parsedMotd}</MotdContainer>;
}
