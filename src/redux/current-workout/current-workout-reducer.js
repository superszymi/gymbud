import { CurrentWorkoutActionTypes } from './current-workout-action-types';

const INITIAL_STATE = {
    currentWorkout: null,
    hours: 0,
    minutes: 0,
    seconds: 0
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
                hours: action.payload.hours,
                minutes: action.payload.minutes,
                seconds: action.payload.seconds
            }
        default:
            return state;
    }
}

export default currentWorkoutReducer;