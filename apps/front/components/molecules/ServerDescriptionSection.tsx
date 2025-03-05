'use client';
import {useAppDispatch, useAppSelector} from '@lib/front/components/store/store';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import type {MDXEditorMethods} from '@mdxeditor/editor';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import {SvgIcon} from '@mui/material';
import Box from '@mui/material/Box';
import type {ServerPaginatedListWithMDXSource} from '@front/components/queries/servers/serverListQuery';
import {updateServerDetailsCommand} from '@front/components/queries/servers/updateServerDetails';
import InitializedMDXEditor from '@front/components/atoms/InitializedMDXEditor';
import ServerInfoContainer from '@front/components/atoms/ServerInfoContainer';
import {useTranslations} from 'next-intl';
import React, {
    type Dispatch,
    type FC,
    type RefObject,
    type SetStateAction,
    useRef,
    useState,
} from 'react';

const StyledEditBox = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(3),
}));

const StyledIcon = styled(SvgIcon, {
    shouldForwardProp: (prop) => prop !== 'colorVariant',
})<{colorVariant?: 'primary' | 'error'}>(({theme, colorVariant = 'primary'}) => ({
    color:
        colorVariant === 'error'
            ? theme.palette.error.light
            : theme.palette.primary.main,
    cursor: 'pointer',
}));

const StyledServerDescriptionContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
}));

type DescriptionSectionProps = {
    mdEditorRef: RefObject<MDXEditorMethods>;
    isEditing: boolean;
} & Pick<ServerDescriptionSectionProps, 'server'>;

const DescriptionSection: FC<DescriptionSectionProps> = ({
    server,
    isEditing,
    mdEditorRef,
}) => {
    const t = useTranslations('page.hostPage');

    if (isEditing) {
        return (
            <InitializedMDXEditor
                editorRef={mdEditorRef}
                markdown={server.description ?? ''}
            />
        );
    }

    return (
        <>
            {server?.description && server.description.length > 0 ? (
                server.mdxSource.content
            ) : (
                <Typography variant="body2" color="textSecondary">
                    {t('noDescription')}
                </Typography>
            )}
        </>
    );
};

type EditorButtonsProps = {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
} & Pick<ServerDescriptionSectionProps, 'server'> &
    Pick<DescriptionSectionProps, 'mdEditorRef'>;

const EditorButtons: FC<EditorButtonsProps> = ({
    isEditing,
    setIsEditing,
    server,
    mdEditorRef,
}) => {
    const t = useTranslations('page.hostPage');
    const dispatch = useAppDispatch();
    const {mutateAsync: updateDetails} = updateServerDetailsCommand(server.host);

    const handleSave = async () => {
        try {
            const markdown = mdEditorRef.current.getMarkdown();
            const updated = await updateDetails({description: markdown});

            dispatch(
                addNotification({
                    id: 'success-save-description',
                    level: 'Success',
                    title: t('descriptionSavedTitle'),
                    description: t('descriptionSavedMessage', {
                        initial: (server.description ?? '').length,
                        changed: updated.description.length,
                    }),
                }),
            );

            server.description = updated.description;
        } catch (error) {
            console.error(error);
            dispatch(
                addNotification({
                    id: 'error-save-description',
                    level: 'Error',
                    title: t('descriptionSaveErrorTitle'),
                    description: t('descriptionSaveErrorMessage'),
                }),
            );
        }
    };

    return (
        <StyledEditBox>
            {isEditing ? (
                <>
                    <Tooltip arrow title={t('saveDescription')}>
                        <StyledIcon component={SaveIcon} onClick={handleSave} />
                    </Tooltip>
                    <Tooltip arrow title={t('exitEditingDescription')}>
                        <StyledIcon
                            component={CloseIcon}
                            colorVariant="error"
                            onClick={() => setIsEditing(false)}
                        />
                    </Tooltip>
                </>
            ) : (
                <Tooltip arrow title={t('editDescription')}>
                    <StyledIcon
                        component={EditIcon}
                        onClick={() => setIsEditing(true)}
                    />
                </Tooltip>
            )}
        </StyledEditBox>
    );
};

type ServerDescriptionSectionProps = {
    server: ServerPaginatedListWithMDXSource;
};

const ServerDescriptionSection = ({server}: ServerDescriptionSectionProps) => {
    const t = useTranslations('page.hostPage');
    const profile = useAppSelector((store) => store.auth.user);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const mdEditorRef = useRef<MDXEditorMethods>(null);

    const isOwner = server.owner_id === profile?.id;

    return (
        <StyledServerDescriptionContainer>
            <ServerInfoContainer direction="column">
                <ServerInfoContainer
                    direction="row"
                    usePadding={false}
                    changeDirectionOnSmallSize={false}
                >
                    <Typography variant="h4" color="textPrimary" gutterBottom>
                        {t('description')}
                    </Typography>

                    {isOwner && (
                        <EditorButtons
                            server={server}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            mdEditorRef={mdEditorRef}
                        />
                    )}
                </ServerInfoContainer>

                <DescriptionSection
                    server={server}
                    isEditing={isEditing}
                    mdEditorRef={mdEditorRef}
                />
            </ServerInfoContainer>
        </StyledServerDescriptionContainer>
    );
};

export default ServerDescriptionSection;
