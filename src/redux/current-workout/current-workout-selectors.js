import { createSelector } from 'reselect';

const selectCurrentWorkout = state => state.currentWorkout;

export const selectCurrentWorkoutItem = createSelector(
    [selectCurrentWorkout],
    workout => workout.currentWorkout
)