import { WorkoutTemplatesActionTypes } from './workout-templates-action-types';

export const updateTemplates = templates => ({
    type: WorkoutTemplatesActionTypes.UPDATE_TEMPLATES,
    payload: templates
})

