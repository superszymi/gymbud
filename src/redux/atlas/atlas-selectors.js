import { createSelector } from 'reselect';

const selectAtlas = state => state.atlas;

const selectCategories = createSelector(
    [selectAtlas],
    atlas => atlas.categories
)

export const selectCategoriesMap = createSelector(
    [selectCategories],
    categories => categories ? Object.keys(categories).map(key => categories[key]) : []
)

export const selectCategory = title => createSelector(
    [selectCategoriesMap],
    categories => categories ? categories.find(category => category.routeName === title) : null
)