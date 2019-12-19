import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';
import WorkoutCompleted from '../workout-completed/workout-completed.component';

import { updateDocumentInCollection } from '../../firebase/firebase.utils';
import { updateWorkoutById } from '../../redux/workouts/workouts-actions';

import './workout-details.styles.scss';


class WorkoutDetails extends React.Component {

    constructor() {
        super();

        this.state = {
            updated: false,
            workout: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.workout && props.updateWorkoutById && !state.workout) {
            return props;
        }
        return null;
    }

    saveWorkout = () => {
        const { workout } = this.state;
        updateDocumentInCollection('workouts', workout);
        this.props.updateWorkoutById(workout);
        this.setState({
            updated: true
        })
    }

    handleExerciseChange = (id, sets) => {
        const { workout } = this.state;
        const { exercises } = workout;
        const index = exercises.indexOf(exercises.find(exercise => exercise.id === id));
        this.setState({
            workout: update(this.state.workout, {exercises: {[index]: {sets: {$set: sets}}}})
        });
    }

    render() {
        const { workout, updated } = this.state;
        return (
            <div className='workout-details'>
                <h1>{workout ? workout.workoutName : '...'}</h1>
                {
                    workout ? workout.exercises.map(({ id, ...otherProps }) => <WorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} {...otherProps} />) : '...'
                }
                <div className='actions'>
                    <CustomButton onClick={this.saveWorkout} >SAVE</CustomButton>
                    <CustomButton onClick={() => this.props.history.push('/workouts')} >BACK</CustomButton>
                </div>
                {
                    updated ? <WorkoutCompleted isCurrent={false} workout={workout} /> : null
                }
            </div>
        )
    }
}

const mapStateToProps = ({ workouts: { workouts } }, { match }) => ({
    workout: Object.keys(workouts).map(key => workouts[key]).find(workout => workout.id === match.params.workoutId)
})

const mapDispatchToProps = dispatch => ({
    updateWorkoutById: workout => dispatch(updateWorkoutById(workout))
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutDetails));