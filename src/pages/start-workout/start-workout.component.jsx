import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { firestore, convertTemplatesSnapshotToMap } from '../../firebase/firebase.utils';
import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';

import StartWorkoutOverview from '../../components/start-workout-overview/start-workout-overview.component';
import WorkoutInProgress from '../../components/workout-in-progress/workout-in-progress.component';
import WithLoading from '../../components/with-loading/with-loading.component';

import './start-workout.styles.scss';

const StartWorkoutOverviewWithLoading = WithLoading(StartWorkoutOverview);
const WorkoutInProgressWithLoading = WithLoading(WorkoutInProgress);

class StartWorkoutPage extends React.Component {
    state = {
        loading: true
    }

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        if(!this.props.currentUser || !this.props.updateTemplates) return null;
        const { updateTemplates, currentUser } = this.props;
        const templatesRef = firestore.collection('workoutTemplates').where('user', '==', firestore.doc(`/users/${currentUser.id}`));
        this.unsubscribeFromSnapshot = templatesRef.get().then(snapshot => {
            const templatesMap = convertTemplatesSnapshotToMap(snapshot);
            updateTemplates(templatesMap);
            if(this.state.loading){
                this.setState({
                    loading: false
                })
            }
        });
    }

    render() {
        const { match } = this.props;
        const { loading } = this.state;
        return (
            <div className='start-workout'>
                <Route exact path={`${match.path}`} render={props => <StartWorkoutOverviewWithLoading isLoading={loading} {...props} />} />
                <Route exact path={`${match.path}/:templateName`} render={props => <WorkoutInProgressWithLoading isLoading={loading} {...props} />} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

export default withRouter(connect(null, mapDispatchToProps)(StartWorkoutPage));