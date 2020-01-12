import { createSelector } from 'reselect';

const selectCurrentWorkout = state => state.currentWorkout;

export const selectCurrentWorkoutItem = createSelector(
    [selectCurrentWorkout],
    workout => workout.currentWorkout
)

export const selectCurrentWorkoutTime = createSelector(
    [selectCurrentWorkout],
    workout => workout.hours
)