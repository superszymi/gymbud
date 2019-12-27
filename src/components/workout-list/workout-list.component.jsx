import React from 'react';
import { connect } from 'react-redux';

import WorkoutItem from '../workout-item/workout-item.component';

import { updateWorkouts } from '../../redux/workouts/workouts-actions';
import { selectWorkoutsMap } from '../../redux/workouts/workouts-selectors';

import './workout-list.styles.scss';

class WorkoutList extends React.Component {

    deleteWorkout = id => {
        this.props.updateWorkouts(this.props.workouts.filter(workout => workout.id !== id));
    }

    render() {
        const { workouts } = this.props;
        return(
            <div className='workout-list'>
                <h1>Your past workouts</h1>
                <h4>If you made a mistake when entering information, you can always edit past workouts</h4>
                {
                    workouts ? workouts.map(workout => <WorkoutItem key={workout.id} workout={workout} handleWorkoutDelete={this.deleteWorkout}/>) : '...'
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    workouts: selectWorkoutsMap(state)
})

const mapDispatchToProps = dispatch => ({
    updateWorkouts: workouts => dispatch(updateWorkouts(workouts))
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutList);