import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import CurrentWorkoutExercise from '../current-workout-exercise/current-workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';
import WorkoutCompleted from '../workout-completed/workout-completed.component';

import { firestore, addDocumentToCollection } from '../../firebase/firebase.utils';
import { updateCurrentWorkout, clearCurrentWorkout } from '../../redux/current-workout/current-workout-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';

import './workout-in-progress.styles.scss';

class WorkoutInProgress extends React.Component {

    constructor() {
        super();

        this.state = {
            workout: null,
            completed: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.workoutTemplate && props.currentUser && props.updateCurrentWorkout && !state.workout) {
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
                time: 0,
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
        this.setState(
            {
                workout: update(this.state.workout, {time: {$set: 10}}),
                completed: true
            }, () => addDocumentToCollection('workouts', this.state.workout)
        );
    }

    handleExerciseChange = (id, sets) => {
        const { exercises } = this.state.workout;
        const index = exercises.indexOf(exercises.find(exercise => exercise.id === id));
        this.setState({
            workout: update(this.state.workout, {exercises: {[index]: {sets: {$set: sets}}}})
        }, () => this.props.updateCurrentWorkout(this.state.workout));
    }

    render() {
        const { workout, completed } = this.state;
        return (
            <div>
                <h1>{workout ? workout.name : '...'}</h1>
                {
                    workout ? workout.exercises.map(({ id, ...otherProps }) => <CurrentWorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} {...otherProps} />) : '...'
                }
                <div className='actions'>
                    <CustomButton onClick={() => this.completeWorkout()} >DONE</CustomButton>
                    <CustomButton onClick={() => {
                        this.props.clearCurrentWorkout();
                        this.props.history.push('/start-workout')
                    }} >BACK</CustomButton>
                </div>
                {
                    completed ? <WorkoutCompleted workout={workout} /> : null
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    workoutTemplate: selectWorkoutTemplate(props.match.params.templateName)(state),
    currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = dispatch => ({
    updateCurrentWorkout: workout => dispatch(updateCurrentWorkout(workout)),
    clearCurrentWorkout: () => dispatch(clearCurrentWorkout())
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutInProgress));