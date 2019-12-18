import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { firestore, convertAtlasSnapshotToMap } from '../../firebase/firebase.utils';
import { updateAtlas } from '../../redux/atlas/atlas-actions';

import './exercise-atlas.styles.scss';
import AtlasOverview from '../../components/atlas-overview/atlas-overview.component';
import AtlasCategoryPage from '../atlas-category/atlas-category.component';

class ExerciseAtlasPage extends React.Component {

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const { updateAtlas } = this.props;
        const collectionRef = firestore.collection('atlas');
        this.unsubscribeFromSnapshot = collectionRef.get().then(snapshot => {
            const collectionMap = convertAtlasSnapshotToMap(snapshot);
            updateAtlas(collectionMap);
        })
    }

    render() {
        const { match } = this.props;
        return (
            <div className='exercise-atlas'>
                <Route exact path={`${match.path}`} component={AtlasOverview} />
                <Route path={`${match.path}/:title`} component={AtlasCategoryPage} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateAtlas: collectionMap => dispatch(updateAtlas(collectionMap))
})


export default connect(null, mapDispatchToProps)(ExerciseAtlasPage);