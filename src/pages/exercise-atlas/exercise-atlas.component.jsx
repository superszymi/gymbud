import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { firestore, convertAtlasSnapshotToMap } from '../../firebase/firebase.utils';
import { updateAtlas } from '../../redux/atlas/atlas-actions';
import { hideDropdown } from '../../redux/chosen-exercises/chosen-exercises-actions';

import './exercise-atlas.styles.scss';
import AtlasOverview from '../../components/atlas-overview/atlas-overview.component';
import AtlasCategory from '../../components/atlas-category/atlas-category.component';
import WithLoading from '../../components/with-loading/with-loading.component';

const AtlasOverviewWithLoading = WithLoading(AtlasOverview);
const AtlasCategoryWithLoading = WithLoading(AtlasCategory);

class ExerciseAtlasPage extends React.Component {
    state = {
        loading: true
    }

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const { updateAtlas } = this.props;
        const collectionRef = firestore.collection('atlas');
        this.unsubscribeFromSnapshot = collectionRef.get().then(async snapshot => {
            const collectionMap = convertAtlasSnapshotToMap(snapshot);
            await updateAtlas(collectionMap);
            this.setState({
                loading: false
            })
        })
    }

    componentWillUnmount() {
        this.props.hideDropdown();
    }

    render() {
        const { match } = this.props;
        const { loading } = this.state;
        return (
            <div className='exercise-atlas'>
                <Route exact path={`${match.path}`} render={(props) => <AtlasOverviewWithLoading isLoading={loading} {...props} />} />
                <Route path={`${match.path}/:title`} render={(props) => <AtlasCategoryWithLoading isLoading={loading} {...props} />} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateAtlas: collectionMap => dispatch(updateAtlas(collectionMap)),
    hideDropdown: () => dispatch(hideDropdown())
})


export default connect(null, mapDispatchToProps)(ExerciseAtlasPage);