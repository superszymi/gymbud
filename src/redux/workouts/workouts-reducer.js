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
        default:
            return state
    }
}

export default workoutsReducer;