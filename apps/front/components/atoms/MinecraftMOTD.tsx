'use client';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {CSSProperties} from 'react';

const colorMap: Record<string, string> = {
    '0': '#000000',
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
    f: '#FFFFFF',
    r: '#FFFFFF',
};

const styleMap: Record<string, CSSProperties> = {
    l: {fontWeight: 'bold'},
    m: {textDecoration: 'line-through'},
    n: {textDecoration: 'underline'},
    o: {fontStyle: 'italic'},
    r: {fontWeight: 'normal', textDecoration: 'none', fontStyle: 'normal'},
};

function parseMotd(motd: string) {
    const parts = [];
    let i = 0;
    let currentStyle: any = {};
    while (i < motd.length) {
        if (motd[i] === '§' && i + 1 < motd.length) {
            const code = motd[i + 1].toLowerCase();
            i += 2;
            if (colorMap[code]) {
                currentStyle = {...currentStyle, color: colorMap[code]};
            } else if (styleMap[code]) {
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
            parts.push(
                <span style={currentStyle} key={parts.length}>
                    {text}
                </span>,
            );
        }
    }
    return parts;
}

const MotdContainer = styled(Box, {
    shouldForwardProp: (name) => name !== 'background',
})<{background: boolean}>(({theme, background = true}) => ({
    backgroundColor: background ? '#000' : undefined,
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    borderRadius: theme.spacing(1),
    overflowX: 'auto',
    color: '#fff',
    fontSize: theme.typography.body2.fontSize,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxWidth: '100%',
}));

type MinecraftMotdProps = {
    motd: string;
    background: boolean;
};

export default function MinecraftMotd({motd, background}: MinecraftMotdProps) {
    return <MotdContainer background={background}>{parseMotd(motd)}</MotdContainer>;
}
