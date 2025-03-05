import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import type {MDXComponents, MDXProps} from 'mdx/types';
import {MDXRemote} from 'next-mdx-remote-client/rsc';
import React, {type FC} from 'react';
import Link from 'next/link';
import {StyledOrderedList} from './styledMDXComponents';

export const markdownComponents: MDXComponents = {
    h1: (props) => (
        <Typography
            color="textPrimary"
            variant="h5"
            component="h1"
            gutterBottom
            {...props}
        />
    ),
    h2: (props) => (
        <Typography
            color="textPrimary"
            variant="h6"
            component="h2"
            gutterBottom
            {...props}
        />
    ),
    h3: (props) => (
        <Typography
            color="textPrimary"
            variant="body1"
            component="h3"
            gutterBottom
            {...props}
        />
    ),
    p: (props) => (
        <Typography color="textPrimary" variant="body2" component="p" {...props} />
    ),
    ul: (props) => <List sx={{paddingLeft: 2}} {...props} />,
    ol: (props) => <StyledOrderedList {...props} />,
    li: (props) => <ListItem sx={{display: 'list-item'}} {...props} />,
    a: (props) => (
        <Link
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            {...props}
        />
    ),
    hr: () => <Divider sx={{marginY: 2}} />,
};

type CustomMdxRemoteProps = {
    mdx: string;
} & MDXProps;

const CustomMdxRemote: FC<CustomMdxRemoteProps> = ({
    mdx,
    components: propsComponents,
}) => {
    return MDXRemote({
        source: mdx,
        components: {...markdownComponents, ...(propsComponents || {})},
    });
};

export default CustomMdxRemote;
