import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import CurrentWorkoutExercise from '../current-workout-exercise/current-workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';
import WorkoutCompleted from '../workout-completed/workout-completed.component';

import { firestore, addDocumentToCollection } from '../../firebase/firebase.utils';
import { updateCurrentWorkout } from '../../redux/current-workout/curent-workout-actions';

import './workout-in-progress.styles.scss';

class WorkoutInProgress extends React.Component {

    constructor() {
        super();

        this.state = {
            workout: null,
            completed: false
        }
    }

    static getDerivedStateFromProps(props) {
        if(props.workoutTemplate && props.currentUser && props.updateCurrentWorkout) {
            const { workoutTemplate: { workoutName, exercises }, updateCurrentWorkout, currentUser } = props;

            const workoutToAdd = {
                name: workoutName,
                exercises: exercises.map(exercise => exercise = {
                    id: exercise.id,
                    name: exercise.name,
                    sets: exercise.sets ? new Array(exercise.sets).fill(0).map(() => ({
                        reps: '',
                        weight: ''
                    })) : null 
                }),
                date: new Date().toLocaleString(),
                time: Date.now(),
                user: firestore.doc(`/users/${currentUser.id}`)
            }
            updateCurrentWorkout(workoutToAdd);
            return {
                workout: workoutToAdd
            }
        }
        return null;
    }

    completeWorkout = () => {
        const { workout } = this.state;
        this.setState({
            workout: update(workout, {time: {$set: (Date.now() - workout.time)/60000}}), //Date in minutes, change that to timer later
            completed: true
        }, () => {
            addDocumentToCollection('workouts', workout);
            updateCurrentWorkout(workout);
        });
    }

    handleExerciseChange = (id, sets) => {
        const { workout } = this.state;
        const { exercises } = workout;
        const index = exercises.indexOf(exercises.find(exercise => exercise.id === id));
        this.setState({
            workout: update(workout, {exercises: {[index]: {sets: {$set: sets}}}})
        });
    }

    render() {
        const { workout, completed } = this.state;
        return (
            <div>
                <h1>{workout ? workout.name : '...'}</h1>
                {
                    workout ? workout.exercises.map(({ id, ...otherProps }) => <CurrentWorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} {...otherProps} />) : '...'
                }
                <CustomButton onClick={this.completeWorkout} >DONE</CustomButton>
                {
                    completed ? <WorkoutCompleted workout={workout} /> : null
                }
            </div>
        )
    }
}

const mapStateToProps = ({ workoutTemplates: { workoutTemplates }, user: { currentUser } }, { match }) => ({
    workoutTemplate: Object.keys(workoutTemplates).map(key => workoutTemplates[key]).find(template => template.workoutName === match.params.templateName),
    currentUser
})

const mapDispatchToProps = dispatch => ({
    updateCurrentWorkout: workout => dispatch(updateCurrentWorkout(workout))
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutInProgress));