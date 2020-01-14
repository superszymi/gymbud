import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';
import WorkoutCompleted from '../workout-completed/workout-completed.component';

import { firestore, addDocumentToCollection } from '../../firebase/firebase.utils';
import { updateCurrentWorkout, clearCurrentWorkout, updateCurrentWorkoutTime } from '../../redux/current-workout/current-workout-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';
import { selectCurrentWorkoutItem, selectCurrentWorkoutTime } from '../../redux/current-workout/current-workout-selectors';

import './workout-in-progress.styles.scss';

class WorkoutInProgress extends React.Component {

    constructor() {
        super();

        this.state = {
            workout: null,
            completed: false,
            hours: 0,
            minutes: 0,
            seconds: 0,
            timerRunning: true
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.workoutTemplate && props.currentUser && props.updateCurrentWorkout && !state.workout) {
            const { workoutTemplate: { workoutName, exercises }, updateCurrentWorkout } = props;
            const { hours, minutes, seconds } = props.currentWorkoutTime;
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
                date: null,
                time: 0,
                user: null
            }
            if(!props.currentWorkout) {
                updateCurrentWorkout(workoutToAdd);
                return {
                    workout: workoutToAdd
                }
            }
            return {
                workout: props.currentWorkout,
                seconds: seconds,
                minutes: minutes,
                hours: hours
            }
        }
        return null;
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        this.props.clearCurrentWorkout();
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.seconds !== this.props.seconds) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, 1000);
        }
    }

    tick = () => {
        var seconds = this.state.seconds;
        var minutes = this.state.minutes;
        var hours = this.state.hours;

        if(seconds + 1 >= 60) {
            seconds = 0;
            if(minutes + 1 >= 60) {
                minutes = 0;
                hours = hours + 1;
            } else {
                minutes = minutes + 1;
            }
        } else {
            seconds = seconds + 1
        }

        this.setState({
            seconds: seconds,
            minutes: minutes,
            hours: hours
        }, () => this.props.updateCurrentWorkoutTime({ hours, minutes, seconds }))
    }

    toggleTimer = () => {
        if(this.state.timerRunning) {
            clearInterval(this.interval)
        } else {
            this.interval = setInterval(this.tick, 1000)
        }
        this.setState({
            timerRunning: !this.state.timerRunning
        })
    }

    completeWorkout = () => {
        var workout = this.state.workout;
        clearInterval(this.interval)

        workout.exercises.forEach(exercise => {
            if (exercise.type !== 'aerobic') {
                exercise.sets.forEach(set => {
                    if(exercise.type === 'weighted') {
                        if(!set.weight.length) {
                            set.weight = 0
                        }
                    }
                    if(!set.reps.length) {
                        set.reps = 0
                    }
                })
            } else {
                if(!exercise.averageHeartRate.length) {
                    exercise.averageHeartRate = 0;
                }
                if(!exercise.duration.length) {
                    exercise.duration = 0;
                }
            }
        });
        workout.date = new Date();
        workout.user = firestore.doc(`/users/${this.props.currentUser.id}`);
        workout.time = this.state.minutes;

        this.setState(
            {
                completed: true
            }, () => addDocumentToCollection('workouts', workout)
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
        const { workout, completed, seconds, minutes, hours, timerRunning } = this.state;
        return (
            <div className='workout-in-progress'>
                <h1>{workout ? workout.workoutName : '...'}</h1>
                <h2>Time elapsed: 
                    <span className='time'>
                        {hours < 10 ? `0${hours}` : hours}:
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                    <span className='timer-button' onClick={() => this.toggleTimer()}>
                        {timerRunning ? <span className='pause-button'>&#10074;&#10074;</span> : <span className='play-button'>&#9658;</span>}
                    </span>
                </h2>
                {
                    workout ? workout.exercises.map(({ id, ...otherProps }) => <WorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} expanded={false} {...otherProps} />) : '...'
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
    currentWorkout: selectCurrentWorkoutItem(state),
    currentWorkoutTime: selectCurrentWorkoutTime(state)
})

const mapDispatchToProps = dispatch => ({
    updateCurrentWorkout: workout => dispatch(updateCurrentWorkout(workout)),
    updateCurrentWorkoutTime: ({ hours, minutes, seconds }) => dispatch(updateCurrentWorkoutTime({ hours, minutes, seconds })),
    clearCurrentWorkout: () => dispatch(clearCurrentWorkout())
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutInProgress));