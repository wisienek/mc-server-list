'use client';
import '@mdxeditor/editor/style.css';
import {styled, useTheme} from '@mui/material/styles';
import {type CSSProperties, type ForwardedRef, useCallback} from 'react';
import {
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    maxLengthPlugin,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    toolbarPlugin,
    frontmatterPlugin,
    UndoRedo,
    Separator,
    BoldItalicUnderlineToggles,
    ListsToggle,
    BlockTypeSelect,
    CreateLink,
    InsertThematicBreak,
} from '@mdxeditor/editor';

const StyledToolbarContainer = styled('div')(({theme}) => ({
    '& .mdxeditor-toolbar': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: theme.spacing(1),
        borderRadius: theme.spacing(1 / 2, 1 / 2, 0, 0),
    },
    '& .mdxeditor-root-contenteditable': {
        border: `1px solid ${theme.palette.background.default}`,
    },
}));

const MDXEditorToolbar = () => {
    return (
        <>
            <UndoRedo />
            <Separator />

            <BoldItalicUnderlineToggles />
            <Separator />

            <ListsToggle />
            <Separator />

            <BlockTypeSelect />
            <Separator />

            <div className="_toolbarToggleSingleGroup_uazmk_222">
                <CreateLink />
                <InsertThematicBreak />
            </div>
        </>
    );
};

type InitializedMDXEditorProps = {
    editorRef?: ForwardedRef<MDXEditorMethods>;
} & MDXEditorProps;

function InitializedMDXEditor({editorRef, ...props}: InitializedMDXEditorProps) {
    const theme = useTheme();

    const editorStyles = {
        '--accentBase': theme.palette.primary.light,
        '--accentBgSubtle': theme.palette.primary.main,
        '--accentBg': theme.palette.primary.dark,
        '--accentBgHover': theme.palette.action.hover,
        '--accentBgActive': theme.palette.action.selected,
        '--accentLine': theme.palette.divider,
        '--accentBorder': theme.palette.primary.main,
        '--accentBorderHover': theme.palette.primary.dark,
        '--accentSolid': theme.palette.primary.contrastText,
        '--accentSolidHover': theme.palette.primary.contrastText,
        '--accentText': theme.palette.text.primary,
        '--accentTextContrast': theme.palette.primary.contrastText,
        '--baseBase': theme.palette.background.default,
        '--baseBgSubtle': theme.palette.background.paper,
        '--baseBg': theme.palette.background.default,
        '--baseBgHover': theme.palette.action.hover,
        '--baseBgActive': theme.palette.action.selected,
        '--baseLine': theme.palette.divider,
        '--baseBorder': theme.palette.divider,
        '--baseBorderHover': theme.palette.divider,
        '--baseSolid': theme.palette.text.primary,
        '--baseSolidHover': theme.palette.text.secondary,
        '--baseText': theme.palette.text.primary,
        '--baseTextContrast': theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
    } as CSSProperties;

    const editorPlugins = useCallback(
        () => [
            toolbarPlugin({
                toolbarContents: () => <MDXEditorToolbar />,
            }),
            headingsPlugin({allowedHeadingLevels: [1, 2, 3]}),
            listsPlugin(),
            quotePlugin(),
            linkPlugin(),
            frontmatterPlugin(),
            tablePlugin(),
            linkDialogPlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            maxLengthPlugin(512),
        ],
        [],
    );

    return (
        <StyledToolbarContainer style={editorStyles}>
            <MDXEditor
                className={`${theme.palette.mode}-theme ${theme.palette.mode}-editor`}
                plugins={editorPlugins()}
                {...props}
                ref={editorRef}
            />
        </StyledToolbarContainer>
    );
}

export default InitializedMDXEditor;
