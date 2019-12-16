import { combineReducers } from 'redux';

import userReducer from './user/user-reducer';
import chosenExercisesReducer from './chosen-exercises/chosen-exercises-reducer';
import atlasReducer from './atlas/atlas-reducer';
import workoutTemplatesReducer from './workout-templates/workout-templates-reducer';
 
export default combineReducers({
    user: userReducer,
    chosenExercises: chosenExercisesReducer,
    atlas: atlasReducer,
    workoutTemplates: workoutTemplatesReducer
});