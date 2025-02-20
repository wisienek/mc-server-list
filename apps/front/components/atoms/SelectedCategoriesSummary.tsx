import {styled} from '@mui/material/styles';
import {ServerCategory} from '@shared/enums';
import {type ComponentProps} from 'react';
import CategoryIcon from './CategoryIcon';

const StyledCategoriesContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.3),
}));

export type SelectedCategoriesSummaryProps = {
    selectedCategories: ServerCategory[];
    bodyProps?: Partial<ComponentProps<typeof StyledCategoriesContainer>>;
    iconProps?: Partial<ComponentProps<typeof CategoryIcon>>;
};

const SelectedCategoriesSummary = ({
    selectedCategories,
    bodyProps = {},
    iconProps = {},
}: SelectedCategoriesSummaryProps) => {
    return (
        <StyledCategoriesContainer {...bodyProps}>
            {selectedCategories.map((category) => (
                <CategoryIcon
                    key={`selected-category-${category}`}
                    category={category}
                    {...iconProps}
                />
            ))}
        </StyledCategoriesContainer>
    );
};

export default SelectedCategoriesSummary;
