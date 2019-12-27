import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user-reducer';
import chosenExercisesReducer from './chosen-exercises/chosen-exercises-reducer';
import atlasReducer from './atlas/atlas-reducer';
import workoutTemplatesReducer from './workout-templates/workout-templates-reducer';
import currentWorkoutReducer from './current-workout/current-workout-reducer';
import workoutsReducer from './workouts/workouts-reducer'; 

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['chosenExercises', 'currentWorkout']
}

const rootReducer = combineReducers({
    user: userReducer,
    chosenExercises: chosenExercisesReducer,
    atlas: atlasReducer,
    workoutTemplates: workoutTemplatesReducer,
    currentWorkout: currentWorkoutReducer,
    workouts: workoutsReducer
});

export default persistReducer(persistConfig, rootReducer);