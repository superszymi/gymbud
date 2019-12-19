import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearCurrentWorkout } from '../../redux/current-workout/current-workout-actions';

import CustomButton from '../custom-button/custom-button.component';

import './workout-completed.styles.scss';

const WorkoutCompleted = ({ isCurrent, workoutName, history, clearCurrentWorkout }) => (
    <div className='popup'>
        <div className='popup-inner'>
            <h1>{workoutName} SAVED!</h1>
            <CustomButton onClick={() => {
                    if(isCurrent) {
                        clearCurrentWorkout();
                        history.push('/dashboard');
                    } else {
                        history.push('/workouts');
                    }
                }}>Done</CustomButton>
        </div>
    </div>
)

const mapDispatchToProps = dispatch => ({
    clearCurrentWorkout: () => dispatch(clearCurrentWorkout())
})

export default withRouter(connect(null, mapDispatchToProps)(WorkoutCompleted));