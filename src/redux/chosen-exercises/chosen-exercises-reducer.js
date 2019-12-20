import { ChosenExercisesActionTypes } from './chosen-exercises-action-types';
import { addExerciseToChosenExercises, removeExerciseSetFromChosenExercises } from './chosen-exercises.utils';

const INITIAL_STATE = {
    hidden: true,
    exercises: []
}

const chosenExercisesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ChosenExercisesActionTypes.TOGGLE_DROPDOWN_HIDDEN:
            return {
                ...state,
                hidden: !state.hidden
            }
        case ChosenExercisesActionTypes.HIDE_DROPDOWN:
            return {
                ...state,
                hidden: true
            }
        case ChosenExercisesActionTypes.ADD_EXERCISE_SET:
            return {
                ...state,
                exercises: addExerciseToChosenExercises(state.exercises, action.payload)
            }
        case ChosenExercisesActionTypes.CLEAR_EXERCISE:
            return {
                ...state,
                exercises: state.exercises.filter(exercise => exercise !== action.payload)
            }
        case ChosenExercisesActionTypes.REMOVE_EXERCISE_SET:
            return {
                ...state,
                exercises: removeExerciseSetFromChosenExercises(state.exercises, action.payload)
            }
        case ChosenExercisesActionTypes.CLEAR_WORKOUT:
            return {
                ...state,
                exercises: []
            }
        case ChosenExercisesActionTypes.UPDATE_EXERCISES:
            return {
                ...state,
                exercises: action.payload
            }
        default:
            return state;
    }
}

export default chosenExercisesReducer;