import { CurrentWorkoutActionTypes } from './current-workout-action-types';

const INITIAL_STATE = {
    currentWorkout: null,
    time: 0
}

const currentWorkoutReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT:
            return {
                ...state,
                currentWorkout: action.payload
            }
        case CurrentWorkoutActionTypes.CLEAR_CURRENT_WORKOUT:
            return {
                ...state,
                currentWorkout: null
            }
        case CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT_TIME:
            return {
                ...state,
                time: action.payload
            }
        default:
            return state;
    }
}

export default currentWorkoutReducer;