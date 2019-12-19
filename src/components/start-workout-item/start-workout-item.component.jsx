import React from 'react';
import { withRouter } from 'react-router-dom';

import CustomButton from '../custom-button/custom-button.component';

import './start-workout-item.styles.scss';

const StartWorkoutItem = ({id,  workoutName, exercises, match, history }) => (
    <div className='start-workout-item'>
        <h1>{workoutName ? workoutName : '...'}</h1>
        <div className='buttons'>
            <CustomButton onClick={() => history.push(`/start-workout/${workoutName}`)}>START</CustomButton>
        </div>
        <div className='details'>
            <h3>Exercises: 
                {
                    exercises ? ' ' + exercises.map(exercise => ' ' + exercise.name) : '...'
                }
            </h3>
        </div>
    </div>
)

export default withRouter(StartWorkoutItem);