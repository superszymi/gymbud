import { createSelector } from 'reselect';

const selectWorkoutTemplates = state => state.workoutTemplates;

const selectWorkoutTemplatesItems = createSelector(
    [selectWorkoutTemplates],
    templates => templates.workoutTemplates
)

export const selectWorkoutTemplatesMap = createSelector(
    [selectWorkoutTemplatesItems],
    templates => templates ? Object.keys(templates).map(key => templates[key]) : []
)

export const selectWorkoutTemplate = name => createSelector(
    [selectWorkoutTemplatesMap],
    templates => templates ? templates.find(template => template.workoutName === name) : null
)