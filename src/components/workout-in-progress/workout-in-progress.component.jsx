import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';

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
            timerRunning: true,
            repDifference: 0,
            weightDifference: 0,
            aeroDifference: 0
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
                            averageHeartRate: exercise.averageHeartRate ? exercise.averageHeartRate : '',
                            duration: exercise.duration ? exercise.duration : ''
                        }
                    } else {
                        return {
                            id: exercise.id,
                            name: exercise.name,
                            type: exercise.type,
                            sets: exercise.goals ? exercise.goals : new Array(exercise.sets).fill(0).map(() => exercise.type === 'weighted' ? ({
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
        const { exercises } = this.props.workoutTemplate;
        var weightDifference = 0;
        var repDifference = 0;
        var aeroDifference = 0;
        clearInterval(this.interval)

        workout.exercises.forEach(exercise => {
            if (exercise.type !== 'aerobic') {
                exercise.sets.forEach(set => {
                    if(exercise.type === 'weighted') {
                        if(!set.weight.length) {
                            set.weight = 0
                        }
                        const weight = exercises[workout.exercises.indexOf(exercise)].goals[exercise.sets.indexOf(set)].weight;
                        if(set.weight !== 0 && weight !== 0) {
                            if(set.weight > weight) {
                                weightDifference++;
                            } else if(set.weight < weight) {
                                weightDifference--;
                            } 
                        }
                    }
                    if(!set.reps.length) {
                        set.reps = 0
                    }
                    const reps = exercises[workout.exercises.indexOf(exercise)].goals[exercise.sets.indexOf(set)].reps;
                    if(set.reps !== 0 && reps !== 0) {
                        if(set.reps > reps) {
                            repDifference++;
                        } else if(set.reps < reps) {
                            repDifference--;
                        } 
                    }
                })
            } else {
                if(!exercise.averageHeartRate.length) {
                    exercise.averageHeartRate = 0;
                }
                if(!exercise.duration.length) {
                    exercise.duration = 0;
                } else {
                    const duration = exercises[workout.exercises.indexOf(exercise)].goals.duration;
                    if(exercise.duration !== 0 && duration !== 0) {
                        if(exercise.duration > duration) {
                            aeroDifference++;
                        } else if(exercise.duration < duration) {
                            aeroDifference--;
                        } 
                    }
                }
            }
        });
        
        workout.date = new Date();
        workout.user = firestore.doc(`/users/${this.props.currentUser.id}`);
        workout.time = Math.floor((this.state.currentTime % (1000*60*60)) / (1000*60));

        this.setState(
            {
                completed: true,
                repDifference: repDifference,
                weightDifference: weightDifference,
                aeroDifference: aeroDifference
            }, () => {
                addDocumentToCollection('workouts', workout);
                updateCurrentWorkoutTime(this.state.currentTime)
            }
        );
    }

    handleExerciseChange = (id, value) => {
        const { workout } = this.state;
        const { exercises } = workout;
        var type = ''
        const index = exercises.indexOf(exercises.find(exercise => {type = exercise.type; return exercise.id === id;}));
        if(type === 'aerobic') {
            var exercise = exercises[index];
            exercise.averageHeartRate = value.averageHeartRate;
            exercise.duration = value.duration;
            this.setState({
                workout: update(workout, {exercises: {[index]: {$set: exercise}}})
            })
        } else {
            this.setState({
                workout: update(workout, {exercises: {[index]: {sets: {$set: value}}}})
            });
        }
    }

    render() {
        const { workout, completed, currentTime, timerRunning, weightDifference, repDifference, aeroDifference } = this.state;
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
                    completed ? 
                    <div>
                    {
                        weightDifference !== 0 || repDifference !== 0 || aeroDifference !== 0 ? 
                        <div className='review-popup'>
                            <div className='review-popup-inner'>
                                { 
                                    weightDifference > 0 || repDifference > 0 || aeroDifference > 0 ? 
                                    <div>
                                        <h3>You exceeded your goals in some exercises!</h3>
                                        <p>Do you wish to update the target goals for this template?</p>
                                    </div>
                                : 
                                    <div>
                                        <h3>You didn't manage to achieve your goals in some exercises!</h3>
                                        <p>Do you wish to update the target goals for this template?</p>
                                    </div>
                                }
                                <CustomButton onClick={() => this.setState({completed: true}, this.props.history.push(`/templates/${workout.workoutName}/goals`))}>YES</CustomButton>
                                <CustomButton inverted onClick={() => this.setState({completed: true}, this.props.history.push('/templates'))}>NO</CustomButton>
                            </div>
                        </div> : 
                        <div className='review-popup'>
                            <div className='review-popup-inner'>
                                <div>
                                    <h3>Workout finished, well done</h3>
                                    <p>Do you wish to update the target goals for this template?</p>
                                </div>
                                <CustomButton onClick={() => this.setState({completed: true}, this.props.history.push(`/templates/${workout.workoutName}/goals`))}>YES</CustomButton>
                                <CustomButton inverted onClick={() => this.setState({completed: true}, this.props.history.push('/templates'))}>NO</CustomButton>
                            </div>
                        </div>
                    }
                    </div> : ''
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