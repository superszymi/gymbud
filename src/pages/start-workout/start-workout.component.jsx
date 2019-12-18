import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { firestore, convertTemplatesSnapshotToMap } from '../../firebase/firebase.utils';
import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';

import StartWorkoutOverview from '../../components/start-workout-overview/start-workout-overview.component';
import WorkoutInProgress from '../../components/workout-in-progress/workout-in-progress.component';

import './start-workout.styles.scss';

class StartWorkoutPage extends React.Component {

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        const { updateTemplates, currentUser } = this.props;
        const templatesRef = firestore.collection('workoutTemplates').where('user', '==', firestore.doc(`/users/${currentUser.id}`));
        this.unsubscribeFromSnapshot = templatesRef.get().then(snapshot => {
            const templatesMap = convertTemplatesSnapshotToMap(snapshot);
            updateTemplates(templatesMap);
        })
    }

    render() {
        const { match } = this.props;
        return (
            <div>
                <Route exact path={`${match.url}`} component={StartWorkoutOverview} />
                <Route path={`${match.url}/:templateName`} component={WorkoutInProgress} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
})

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkoutPage);