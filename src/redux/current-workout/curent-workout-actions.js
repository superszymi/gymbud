import { CurrentWorkoutActionTypes } from './current-workout-action-types';

export const updateCurrentWorkout = workout => ({
    type: CurrentWorkoutActionTypes.UPDATE_CURRENT_WORKOUT,
    payload: workout
})