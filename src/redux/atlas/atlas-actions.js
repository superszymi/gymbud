import { AtlasActionTypes } from './atlas-action-types';

export const updateAtlas = (collectionMap) => ({
    type: AtlasActionTypes.UPDATE_ATLAS,
    payload: collectionMap
})