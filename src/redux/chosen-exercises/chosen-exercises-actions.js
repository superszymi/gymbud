import { ChosenExercisesActionTypes } from './chosen-exercises-action-types';

export const toggleDropdownHidden = () => ({
    type: ChosenExercisesActionTypes.TOGGLE_DROPDOWN_HIDDEN
})

export const hideDropdown = () => ({
    type: ChosenExercisesActionTypes.HIDE_DROPDOWN
})

export const addExerciseSet = exercise => ({
    type: ChosenExercisesActionTypes.ADD_EXERCISE_SET,
    payload: exercise
})

export const addExercise = exercise => ({
    type: ChosenExercisesActionTypes.ADD_EXERCISE,
    payload: exercise
})

export const clearExercise = exercise => ({
    type: ChosenExercisesActionTypes.CLEAR_EXERCISE,
    payload: exercise
})

export const removeExerciseSet = exercise => ({
    type: ChosenExercisesActionTypes.REMOVE_EXERCISE_SET,
    payload: exercise
})

export const clearWorkout = () => ({
    type: ChosenExercisesActionTypes.CLEAR_WORKOUT
})

export const updateExercises = exercises => ({
    type: ChosenExercisesActionTypes.UPDATE_EXERCISES,
    payload: exercises
})