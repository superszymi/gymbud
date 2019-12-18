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
        default:
            return state;
    }
}

export default workoutTemplatesReducer;