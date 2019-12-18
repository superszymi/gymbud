import {WorkoutsActionTypes} from './workouts-action-types';

export const updateWorkouts = workouts => ({
    type: WorkoutsActionTypes.UPDATE_WORKOUTS,
    payload: workouts
})