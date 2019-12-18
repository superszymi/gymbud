import React from 'react';
import { connect } from 'react-redux';

import StartWorkoutItem from '../start-workout-item/start-workout-item.component';

import './start-workout-overview.styles.scss';

const StartWorkoutOverview = ({ workoutTemplates }) => (
    <div>
        {
            workoutTemplates ? workoutTemplates.map(({ id, ...otherProps }) => <StartWorkoutItem key={id} {...otherProps} />) : '...'
        }
    </div>
)


const mapStateToProps = ({ workoutTemplates: { workoutTemplates } }) => ({
    workoutTemplates: Object.keys(workoutTemplates).map(key => workoutTemplates[key])
})

export default connect(mapStateToProps)(StartWorkoutOverview);
