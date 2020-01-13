import { createSelector } from 'reselect';

const selectCurrentWorkout = state => state.currentWorkout;

export const selectCurrentWorkoutItem = createSelector(
    [selectCurrentWorkout],
    workout => workout.currentWorkout
)

export const selectCurrentWorkoutTime = createSelector(
    [selectCurrentWorkout],
    workout => ({hours: workout.hours, minutes: workout.minutes, seconds: workout.seconds})
)