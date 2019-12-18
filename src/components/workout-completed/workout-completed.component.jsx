import React from 'react';
import { withRouter } from 'react-router-dom';

import CustomButton from '../custom-button/custom-button.component';

import './workout-completed.styles.scss';

const WorkoutCompleted = ({ workoutName, history }) => (
    <div className='popup'>
        <div className='popup-inner'>
            <h1>{workoutName} COMPLETED!</h1>
            <CustomButton onClick={() => history.push('/dashboard')}>Done</CustomButton>
        </div>
    </div>
)

export default withRouter(WorkoutCompleted);