import { CurrentWorkoutActionTypes } from './current-workout-action-types';

export const updateCurrentWorkout = workout => ({
    type: CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT,
    payload: workout
})

export const clearCurrentWorkout = () => ({
    type: CurrentWorkoutActionTypes.CLEAR_CURRENT_WORKOUT
})

export const updateCurrentWorkoutTime = time => ({
    type: CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT_TIME,
    payload: time
})