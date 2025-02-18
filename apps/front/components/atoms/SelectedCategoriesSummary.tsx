import {styled} from '@mui/material/styles';
import {ServerCategory} from '@shared/enums';
import CategoryIcon from './CategoryIcon';

const StyledCategoriesContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.3),
}));

export type SelectedCategoriesSummaryProps = {
    selectedCategories: ServerCategory[];
};

const SelectedCategoriesSummary = ({
    selectedCategories,
}: SelectedCategoriesSummaryProps) => {
    return (
        <StyledCategoriesContainer>
            {selectedCategories.map((category) => (
                <CategoryIcon
                    key={`selected-category-${category}`}
                    category={category}
                />
            ))}
        </StyledCategoriesContainer>
    );
};

export default SelectedCategoriesSummary;
