import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import {useTranslations} from 'next-intl';
import {type FC} from 'react';
import {ServerDetailsDto} from '@shared/dto';
import {ServerCategory} from '@shared/enums';
import ServerCategoriesSelect, {useCategories} from './ServerCategoriesSelect';
import SelectedCategoriesSummary from './SelectedCategoriesSummary';

const InputsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const StyledBox = styled(Box)(() => ({
    minWidth: '300px',
}));

type AddCategoriesModalProps = {
    server: ServerDetailsDto;
    open: boolean;
    addAction: (categories: ServerCategory[]) => void;
    handleClose: () => void;
};

const AddCategoriesModal: FC<AddCategoriesModalProps> = ({
    server,
    addAction,
    open,
    handleClose,
}) => {
    const t = useTranslations('page.hostPage.categoriesModal');

    const {
        selectedCategories,
        showCategoriesContainer,
        triggerCategory,
        setShowCategoriesContainer,
    } = useCategories(server.categories);

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="pick-categories-dialog"
            aria-modal="true"
            open={open}
        >
            <StyledBox>
                <DialogTitle sx={{m: 0, p: 2}} id="pick-categories-dialog">
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
                    <Typography variant="subtitle1">
                        {t('selectedCategoriesTitle')}:
                    </Typography>
                    {selectedCategories.length > 0 && (
                        <InputsContainer>
                            <SelectedCategoriesSummary
                                selectedCategories={selectedCategories}
                            />
                        </InputsContainer>
                    )}

                    {showCategoriesContainer && (
                        <>
                            <Divider />

                            <ServerCategoriesSelect
                                selectedCategories={selectedCategories}
                                showCategoriesContainer={true}
                                triggerSelect={triggerCategory}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={() =>
                            setShowCategoriesContainer(!showCategoriesContainer)
                        }
                    >
                        {t(
                            showCategoriesContainer
                                ? 'hideCategories'
                                : 'showCategories',
                        )}
                    </Button>
                    <Button autoFocus onClick={() => addAction(selectedCategories)}>
                        {t('save')}
                    </Button>
                </DialogActions>
            </StyledBox>
        </Dialog>
    );
};

export default AddCategoriesModal;
