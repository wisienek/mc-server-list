import IconButton from '@mui/material/IconButton';
import MuiAddIcon from '@mui/icons-material/Add';
import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {ServerCategory} from '@shared/enums';
import {useTranslations} from 'next-intl';
import {type ComponentProps} from 'react';
import CategoryIcon from './CategoryIcon';

const StyledCategoriesContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.3),
}));

const StyledAddIcon = styled(IconButton, {
    shouldForwardProp: (name: string) => name !== 'addMargin',
})<{addMargin: boolean}>(({theme, addMargin}) => ({
    marginLeft: addMargin ? theme.spacing(2) : 0,
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    fontSize: '1rem',
}));

export type SelectedCategoriesSummaryProps = {
    selectedCategories: ServerCategory[];
    bodyProps?: Partial<ComponentProps<typeof StyledCategoriesContainer>>;
    iconProps?: Partial<ComponentProps<typeof CategoryIcon>>;
    showAddIcon?: boolean;
    addIconAction?: () => void;
    removeIconAction?: (category: ServerCategory) => void;
};

const SelectedCategoriesSummary = ({
    selectedCategories,
    bodyProps = {},
    iconProps = {},
    showAddIcon,
    addIconAction,
    removeIconAction,
}: SelectedCategoriesSummaryProps) => {
    const t = useTranslations('page.hostPage');

    const AddIcon = () => {
        if (!showAddIcon) {
            return <></>;
        }

        return (
            <Tooltip arrow title={t('addCategory')}>
                <StyledAddIcon
                    color="primary"
                    aria-label="add-icon"
                    onClick={addIconAction}
                    addMargin={selectedCategories.length > 0}
                >
                    <MuiAddIcon />
                </StyledAddIcon>
            </Tooltip>
        );
    };

    return (
        <StyledCategoriesContainer {...bodyProps}>
            {selectedCategories.map((category) => (
                <CategoryIcon
                    key={`selected-category-${category}`}
                    category={category}
                    onRemove={removeIconAction}
                    {...iconProps}
                />
            ))}
            <AddIcon />
        </StyledCategoriesContainer>
    );
};

export default SelectedCategoriesSummary;
