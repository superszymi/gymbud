import {WorkoutsActionTypes} from './workouts-action-types';

export const updateWorkouts = workouts => ({
    type: WorkoutsActionTypes.UPDATE_WORKOUTS,
    payload: workouts
})

export const updateWorkoutById = (workout) => ({
    type: WorkoutsActionTypes.UPDATE_WORKOUT_BY_ID,
    payload: workout
})