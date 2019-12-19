import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { firestore, convertTemplatesSnapshotToMap } from '../../firebase/firebase.utils';
import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';

import StartWorkoutOverview from '../../components/start-workout-overview/start-workout-overview.component';
import WorkoutInProgress from '../../components/workout-in-progress/workout-in-progress.component';

import './start-workout.styles.scss';

class StartWorkoutPage extends React.Component {

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
        });
    }

    render() {
        const { match } = this.props;
        return (
            <div className='start-workout'>
                <Route exact path={`${match.path}`} component={StartWorkoutOverview} />
                <Route exact path={`${match.path}/:templateName`} component={WorkoutInProgress} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StartWorkoutPage));