import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { firestore, convertAtlasSnapshotToMap } from '../../firebase/firebase.utils';
import { updateAtlas } from '../../redux/atlas/atlas-actions';
import { hideDropdown, clearWorkout } from '../../redux/chosen-exercises/chosen-exercises-actions';

import AtlasOverview from '../../components/atlas-overview/atlas-overview.component';
import AtlasCategory from '../../components/atlas-category/atlas-category.component';
import WithLoading from '../../components/with-loading/with-loading.component';
import ReviewTemplate from '../../components/review-template/review-template.component';

import './exercise-atlas.styles.scss';

const AtlasOverviewWithLoading = WithLoading(AtlasOverview);
const AtlasCategoryWithLoading = WithLoading(AtlasCategory);
const ReviewTemplateWithLoading = WithLoading(ReviewTemplate);

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
        this.props.clearWorkout();
    }

    render() {
        const { match, currentUser } = this.props;
        const { loading } = this.state;
        return (
            <div className='exercise-atlas'>
                <Route exact path={`${match.path}`} render={(props) => <AtlasOverviewWithLoading isLoading={loading} {...props} />} />
                <Switch>
                    <Route exact path={`${match.path}/review-template`} render={props => <ReviewTemplateWithLoading currentUser={currentUser} {...props} /> } />
                    <Route exact path={`${match.path}/:title`} render={(props) => <AtlasCategoryWithLoading isLoading={loading} {...props} />} />
                </Switch>
                </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateAtlas: collectionMap => dispatch(updateAtlas(collectionMap)),
    hideDropdown: () => dispatch(hideDropdown()),
    clearWorkout: () => dispatch(clearWorkout())
})


export default connect(null, mapDispatchToProps)(ExerciseAtlasPage);