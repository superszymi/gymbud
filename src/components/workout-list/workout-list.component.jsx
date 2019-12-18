import React from 'react';
import { connect } from 'react-redux';

import './workout-list.styles.scss';

const WorkoutList = ({ workouts }) => (
    <div className='workout-list'>
        {
            workouts ? workouts.map(workout => <h1 key={workout.id}>{workout.workoutName} from {workout.date.substring(0, 10)}</h1>) : '...'
        }
    </div>
)

const mapStateToProps = ({ workouts: { workouts } }) => ({
    workouts: Object.keys(workouts).map(key => workouts[key])
})

export default connect(mapStateToProps)(WorkoutList);