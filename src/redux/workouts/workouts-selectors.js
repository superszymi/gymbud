import { createSelector } from 'reselect';

const selectWorkouts = state => state.workouts;

const selectWorkoutsItems = createSelector(
    [selectWorkouts],
    workouts => workouts.workouts
)

export const selectWorkoutsMap = createSelector(
    [selectWorkoutsItems],
    workouts => workouts ? Object.keys(workouts).map(key => workouts[key]) : []
)

export const selectWorkout = id => createSelector(
    [selectWorkoutsMap],
    workouts => workouts ? workouts.find(workout => workout.id === id) : null
)