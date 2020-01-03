import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';
import WorkoutCompleted from '../workout-completed/workout-completed.component';

import { firestore, addDocumentToCollection } from '../../firebase/firebase.utils';
import { updateCurrentWorkout, clearCurrentWorkout } from '../../redux/current-workout/current-workout-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';
import { selectCurrentWorkoutItem } from '../../redux/current-workout/current-workout-selectors';

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
                workoutName: workoutName,
                exercises: exercises.map(exercise => {
                    if(exercise.type === 'aerobic') {
                        return {
                            id: exercise.id,
                            name: exercise.name,
                            type: exercise.type,
                            averageHeartRate: '',
                            duration: ''
                        }
                    } else {
                        return {
                            id: exercise.id,
                            name: exercise.name,
                            type: exercise.type,
                            sets: new Array(exercise.sets).fill(0).map(() => exercise.type === 'weighted' ? ({
                                reps: '',
                                weight: ''
                            }) : ({
                                reps: ''
                            }))
                        }
                    }
                }),
                date: new Date().toLocaleString(),
                time: new Date(),
                user: firestore.doc(`/users/${currentUser.id}`)
            }
            if(!props.currentWorkout) {
                updateCurrentWorkout(workoutToAdd);
                return {
                    workout: workoutToAdd
                }
            }
            return {
                workout: props.currentWorkout
            }
        }
        return null;
    }

    componentWillUnmount() {
        this.props.clearCurrentWorkout();
    }

    completeWorkout = () => {
        const finished = new Date();
        this.setState(
            {
                workout: update(this.state.workout, {time: {$set: Math.round((finished - this.state.workout.time)/60000) }}),
                completed: true
            }, () => {
                addDocumentToCollection('workouts', this.state.workout)
            }
        );
    }

    handleExerciseChange = (id, value) => {
        const { exercises } = this.state.workout;
        const index = exercises.indexOf(exercises.find(exercise => exercise.id === id));
        id > 800 && id < 900 ? 
        this.setState({
            workout: update(this.state.workout, {exercises: {[index]: {[value.name]: {$set: value.value}}}})
        }, () => this.props.updateCurrentWorkout(this.state.workout)) : this.setState({
            workout: update(this.state.workout, {exercises: {[index]: {sets: {$set: value}}}})
        }, () => this.props.updateCurrentWorkout(this.state.workout));
    }

    render() {
        const { workout, completed } = this.state;
        return (
            <div>
                <h1>{workout.workoutName}</h1>
                {
                    workout.exercises.map(({ id, ...otherProps }) => <WorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} expanded={false} {...otherProps} />)
                }
                <div className='actions'>
                    <CustomButton inverted onClick={() => this.completeWorkout()} >DONE</CustomButton>
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
    currentUser: selectCurrentUser(state),
    currentWorkout: selectCurrentWorkoutItem(state)
})

const mapDispatchToProps = dispatch => ({
    updateCurrentWorkout: workout => dispatch(updateCurrentWorkout(workout)),
    clearCurrentWorkout: () => dispatch(clearCurrentWorkout())
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutInProgress));