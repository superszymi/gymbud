import { AtlasActionTypes } from './atlas-action-types';

const INITIAL_STATE = {
    categories: null
} 

const atlasReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case AtlasActionTypes.UPDATE_ATLAS:
            return {
                ...state,
                categories: action.payload
            }
        default:
            return state;
    }
}

export default atlasReducer;