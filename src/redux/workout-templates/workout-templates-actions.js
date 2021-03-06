import { WorkoutTemplatesActionTypes } from './workout-templates-action-types';

export const updateTemplates = templates => ({
    type: WorkoutTemplatesActionTypes.UPDATE_TEMPLATES,
    payload: templates
})

export const updateTemplateById = template => ({
    type: WorkoutTemplatesActionTypes.UPDATE_TEMPLATE_BY_ID,
    payload: template
})

