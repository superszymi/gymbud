import React from 'react';
import { withRouter } from 'react-router-dom';

import './start-workout-item.styles.scss';

const StartWorkoutItem = ({ workoutName, exercises, match, history }) => (
    <div onClick={() => history.push(`${match.url}/${workoutName}`)}>
        <h1>{workoutName ? workoutName : '...'}</h1>
        {
            exercises ? exercises.map(exercise => <h3 key={exercise.id}>{exercise.name}</h3>) : '...'
        }
    </div>
)

export default withRouter(StartWorkoutItem);