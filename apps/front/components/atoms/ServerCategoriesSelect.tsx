'use client';
import {styled} from '@mui/material/styles';
import {ServerCategory} from '@shared/enums';
import React, {type FC, useState} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ServerCategoryMapper from '../consts/ServerCategoryMapper';

const StyledCategoryContainer = styled(Paper, {
    shouldForwardProp: (propName) =>
        !['color', 'selected'].includes(propName as string),
})<{color: string; selected: boolean}>(({theme, color, selected}) => ({
    userSelect: 'none',
    backgroundColor: color,
    padding: theme.spacing(1.1),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'fit-content',
    transition: 'transform 0.2s',
    ...(selected
        ? {
              textDecoration: selected ? 'underline' : 'none',
              WebkitTextStroke: selected ? 'thin' : 'unset',
              transform: 'scale(1.04)',
          }
        : {}),
    '&:hover': {transform: 'scale(1.04)'},
}));

const StyledAvatarIcon = styled(Avatar)(({theme}) => ({
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
}));

type CategoryItemProps = {
    category: ServerCategory;
    selected: boolean;
    triggerSelect: (category: ServerCategory) => void;
};

export const CategoryItem: FC<CategoryItemProps> = ({
    category,
    selected,
    triggerSelect,
}) => {
    const config = ServerCategoryMapper[category];

    return (
        <StyledCategoryContainer
            elevation={3}
            color={config.color}
            selected={selected}
            onClick={() => triggerSelect(category)}
        >
            <StyledAvatarIcon>{config.icon}</StyledAvatarIcon>
            <Typography variant="body1" sx={{fontWeight: 500}}>
                {category}
            </Typography>
        </StyledCategoryContainer>
    );
};

export const useCategories = (initialCategories?: ServerCategory[]) => {
    const [selectedCategories, setSelectedCategories] = useState<ServerCategory[]>(
        initialCategories ?? [],
    );
    const [showCategoriesContainer, setShowCategoriesContainer] =
        useState<boolean>(false);

    const triggerCategory = (category: ServerCategory) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? [...prev.filter((c) => c !== category)]
                : [...prev, category],
        );
    };

    return {
        selectedCategories,
        triggerCategory,
        showCategoriesContainer,
        setShowCategoriesContainer,
    };
};

type CategoryListProps = {
    categories?: ServerCategory[];
    selectedCategories: ServerCategory[];
    showCategoriesContainer: boolean;
} & Pick<CategoryItemProps, 'triggerSelect'>;

const ServerCategoriesSelect: FC<CategoryListProps> = ({
    categories = Object.values(ServerCategory),
    selectedCategories,
    showCategoriesContainer = false,
    triggerSelect,
}) => {
    return showCategoriesContainer ? (
        <Box sx={{flexGrow: 1, padding: 2}}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                {categories.map((category) => (
                    <Grid key={category}>
                        <CategoryItem
                            category={category}
                            selected={selectedCategories.includes(category)}
                            triggerSelect={triggerSelect}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    ) : (
        <></>
    );
};

export default ServerCategoriesSelect;
