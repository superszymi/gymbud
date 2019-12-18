import { CurrentWorkoutActionTypes } from './current-workout-action-types';

const INITIAL_STATE = {
    name: '',
    date: null,
    time: 0,
    exercises: []
}

const currentWorkoutReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT:
            const { name, date, time, exercises, user } = action.payload;
            return {
                ...state,
                name: name,
                date: date,
                time: time,
                exercises: exercises,
                user: user
            }
        default:
            return state;
    }
}

export default currentWorkoutReducer;