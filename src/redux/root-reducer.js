import { combineReducers } from 'redux';
import { persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import Flatted from 'flatted';

import userReducer from './user/user-reducer';
import chosenExercisesReducer from './chosen-exercises/chosen-exercises-reducer';
import atlasReducer from './atlas/atlas-reducer';
import workoutTemplatesReducer from './workout-templates/workout-templates-reducer';
import currentWorkoutReducer from './current-workout/current-workout-reducer';
import workoutsReducer from './workouts/workouts-reducer'; 

export const transformCircular = createTransform(
    (inboundState, key) => Flatted.stringify(inboundState),
    (outboundState, key) => Flatted.parse(outboundState),
)

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'chosenExercises', 'currentWorkout', 'atlas', 'workouts', 'workoutTemplates'],
    transforms: [transformCircular]
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