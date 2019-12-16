//import { WorkoutTemplatesActionTypes } from './workout-templates-action-types';

const INITIAL_STATE = {
    workoutTemplates: []
}

const workoutTemplatesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export default workoutTemplatesReducer;