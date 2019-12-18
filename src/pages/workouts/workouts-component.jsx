import React from 'react';
import { connect } from 'react-redux';

import WorkoutList from '../../components/workout-list/workout-list.component';

import { firestore, convertWorkoutsSnapshotToMap } from '../../firebase/firebase.utils';
import { updateWorkouts } from '../../redux/workouts/workouts-actions';

import './workouts.styles.scss';

class WorkoutsPage extends React.Component {

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        if(!this.props.currentUser || !this.props.updateWorkouts) return null;

        const { updateWorkouts, currentUser } = this.props;
        const workoutsRef = firestore.collection('workouts').where('user', '==', firestore.doc(`/users/${currentUser.id}`));
        this.unsubscribeFromSnapshot = workoutsRef.get().then(snapshot => {
            const workoutsMap = convertWorkoutsSnapshotToMap(snapshot);
            updateWorkouts(workoutsMap);
        });
    }

    render() {
        return(
            <div className='workouts'>
                <WorkoutList />
            </div>
        )
    }
}

const mapStateToProps = ({ user: { currentUser } }) => ({
    currentUser
})

const mapDispatchToProps = dispatch => ({
    updateWorkouts: workouts => dispatch(updateWorkouts(workouts))
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsPage);