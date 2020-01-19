import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';

import { updateDocumentInCollection } from '../../firebase/firebase.utils';
import { updateWorkoutById } from '../../redux/workouts/workouts-actions';
import { selectWorkout } from '../../redux/workouts/workouts-selectors';

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
        var type = ''
        const index = exercises.indexOf(exercises.find(exercise => {type = exercise.type; return exercise.id === id;}));
        if(type === 'aerobic') {
            var exercise = exercises[index];
            exercise.averageHeartRate = sets.averageHeartRate;
            exercise.duration = sets.duration;

            this.setState({
                workout: update(workout, {exercises: {[index]: {$set: exercise}}})
            })
        } else {
            this.setState({
                workout: update(workout, {exercises: {[index]: {sets: {$set: sets}}}})
            });
        }
    }

    render() {
        const { workout, updated } = this.state;
        return (
            <div className='workout-details'>
                <h1>{workout ? workout.workoutName : '...'}</h1>
                {
                    workout ? workout.exercises.map(({ id, ...otherProps }) => <WorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} expanded={true} {...otherProps} />) : '...'
                }
                <div className='actions'>
                    <CustomButton onClick={this.saveWorkout} >SAVE</CustomButton>
                    <CustomButton inverted onClick={() => this.props.history.goBack()} >BACK</CustomButton>
                </div>
                {
                    updated ? 
                    <div className='review-popup'>
                        <div className='review-popup-inner'>
                            <div>
                                <h3>Changes saved</h3>
                                <p>Press ok to go back to the workout list</p>
                            </div>
                            <CustomButton onClick={() => this.setState({updated: false}, this.props.history.push('/workouts'))}>OK</CustomButton>
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    workout: selectWorkout(props.match.params.workoutId)(state)
})

const mapDispatchToProps = dispatch => ({
    updateWorkoutById: workout => dispatch(updateWorkoutById(workout))
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutDetails));