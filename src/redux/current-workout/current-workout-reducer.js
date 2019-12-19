import { CurrentWorkoutActionTypes } from './current-workout-action-types';

const INITIAL_STATE = {
    currentWorkout: null
}

const currentWorkoutReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT:
            return {
                currentWorkout: action.payload
            }
        case CurrentWorkoutActionTypes.CLEAR_CURRENT_WORKOUT:
            return {
                currentWorkout: INITIAL_STATE
            }
        default:
            return state;
    }
}

export default currentWorkoutReducer;