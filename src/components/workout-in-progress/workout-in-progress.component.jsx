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
            startTime: new Date().getTime(),
            currentTime: 0,
            pauseTime: 0,
            pause: 0,
            timerRunning: true
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.workoutTemplate && props.currentUser && props.updateCurrentWorkout && !state.workout) {
            const { workoutTemplate: { workoutName, exercises }, updateCurrentWorkout } = props;
            const time = props.currentWorkoutTime;
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
                startTime: new Date().getTime() - time
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
        if(prevProps.time !== this.props.time) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, 1000);
        }
    }

    tick = () => {
        const start = this.state.startTime;
        const now = new Date().getTime();
        const pause = this.state.pauseTime;
        const time = now - start - pause;
        
        this.setState({
            currentTime: time
        }, () => this.props.updateCurrentWorkoutTime(time))
    }

    toggleTimer = () => {
        if(this.state.timerRunning) {
            this.setState({
                pause: new Date().getTime()
            }, () => clearInterval(this.interval))
        } else {
            this.setState({
                pauseTime: this.state.pauseTime + (new Date().getTime() - this.state.pause)
            }, () => this.interval = setInterval(this.tick, 1000))
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
        workout.time = Math.floor((this.state.currentTime % (1000*60*60)) / (1000*60));

        this.setState(
            {
                completed: true
            }, () => {
                addDocumentToCollection('workouts', workout);
                updateCurrentWorkoutTime(this.state.currentTime)
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
        const { workout, completed, currentTime, timerRunning } = this.state;
        const hours = Math.floor((currentTime % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((currentTime % (1000*60*60)) / (1000*60))
        const seconds = Math.floor((currentTime % (1000*60)) / 1000)
        return (
            <div className='workout-in-progress'>
                <h1>{workout ? workout.workoutName : '...'}</h1>
                <h2>Time elapsed: 
                    <span className='time'>
                        {hours ? (hours < 10 ? `0${hours}` : hours) : '00'}:
                        {minutes ? (minutes < 10 ? `0${minutes}` : minutes) : '00'}:
                        {seconds ? (seconds < 10 ? `0${seconds}` : seconds) : '00'}
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
    updateCurrentWorkoutTime: time => dispatch(updateCurrentWorkoutTime(time)),
    clearCurrentWorkout: () => dispatch(clearCurrentWorkout())
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkoutInProgress));