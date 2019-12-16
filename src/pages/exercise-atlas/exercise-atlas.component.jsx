import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';

import './exercise-atlas.styles.scss';
import AtlasOverview from '../../components/atlas-overview/atlas-overview.component';
import AtlasCategoryPage from '../atlas-category/atlas-category.component';

class ExerciseAtlasPage extends React.Component {

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const collectionRef = firestore.collection('atlas');
        collectionRef.onSnapshot(async snapshot => {
            convertCollectionsSnapshotToMap(snapshot);
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

const mapStateToProps = ({ atlas: { categories } }) => ({
    categories
})

export default connect(mapStateToProps)(ExerciseAtlasPage);