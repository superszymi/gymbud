import { WorkoutTemplatesActionTypes } from './workout-templates-action-types';

const INITIAL_STATE = {
    workoutTemplates: []
}

const workoutTemplatesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case WorkoutTemplatesActionTypes.UPDATE_TEMPLATES:
            return {
                ...state,
                workoutTemplates: action.payload
            }
        case WorkoutTemplatesActionTypes.UPDATE_TEMPLATE_BY_ID:
            return {
                workoutTemplates: Object.keys(state.workoutTemplates).map(key =>
                    state.workoutTemplates[key]).map(template => template.id === action.payload.id ? action.payload : template)
            }
        default:
            return state;
    }
}

export default workoutTemplatesReducer;