import { WorkoutsActionTypes } from './workouts-action-types';

const INITIAL_STATE = {
    workouts: []
}

const workoutsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case WorkoutsActionTypes.UPDATE_WORKOUTS:
            return {
                ...state,
                workouts: action.payload
            }
        case WorkoutsActionTypes.UPDATE_WORKOUT_BY_ID:
            return {
                workouts: Object.keys(state.workouts).map(key =>
                    state.workouts[key]).map(workout => workout.id === action.payload.id ? action.payload : workout)
            }
        default:
            return state
    }
}

export default workoutsReducer;