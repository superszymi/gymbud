import { createSelector } from 'reselect';

const selectChosenExercises = state => state.chosenExercises;

export const selectChosenExercisesItems = createSelector(
    [selectChosenExercises],
    chosenExercises => chosenExercises.exercises
)

export const selectChosenExercisesWorkoutName = createSelector(
    [selectChosenExercises],
    chosenExercises => chosenExercises.workoutName
)

export const selectChosenExercisesCount = createSelector(
    [selectChosenExercisesItems],
    exercises => exercises.length
)

export const selectChosenExercisesSetCount = createSelector(
    [selectChosenExercisesItems],
    exercises => exercises.reduce((accumulator, currentObject) => 
    currentObject.sets ? accumulator + currentObject.sets : accumulator, 0)
)

export const selectChosenExercisesId = createSelector(
    [selectChosenExercises],
    exercises => exercises.id
)