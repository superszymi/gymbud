import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import WorkoutList from '../../components/workout-list/workout-list.component';
import WorkoutDetails from '../../components/workout-details/workout-details.component';
import WithLoading from '../../components/with-loading/with-loading.component';

import { firestore, convertWorkoutsSnapshotToMap } from '../../firebase/firebase.utils';
import { updateWorkouts } from '../../redux/workouts/workouts-actions';

import './workouts.styles.scss';

const WorkoutListWithLoading = WithLoading(WorkoutList);
const WorkoutDetailsWithLoading = WithLoading(WorkoutDetails);

class WorkoutsPage extends React.Component {
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
        if(!this.props.currentUser || !this.props.updateWorkouts) return null;

        const { updateWorkouts, currentUser } = this.props;
        const workoutsRef = firestore.collection('workouts').where('user', '==', firestore.doc(`/users/${currentUser.id}`));
        this.unsubscribeFromSnapshot = workoutsRef.get().then(snapshot => {
            const workoutsMap = convertWorkoutsSnapshotToMap(snapshot);
            updateWorkouts(workoutsMap);
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
        return(
            <div className='workouts'>
                <Route exact path={`${match.url}`} render={props => <WorkoutListWithLoading isLoading={loading} {...props} /> } />
                <Route exact path={`${match.url}/:workoutId`} render={props => <WorkoutDetailsWithLoading isLoading={loading} {...props} /> } />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateWorkouts: workouts => dispatch(updateWorkouts(workouts))
})

export default connect(null, mapDispatchToProps)(WorkoutsPage);