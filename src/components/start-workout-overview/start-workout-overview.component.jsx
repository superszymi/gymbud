import React from 'react';
import { connect } from 'react-redux';

import StartWorkoutItem from '../start-workout-item/start-workout-item.component';

import { selectWorkoutTemplatesMap } from '../../redux/workout-templates/workout-templates-selectors';

import './start-workout-overview.styles.scss';

const StartWorkoutOverview = ({ workoutTemplates }) => (
    <div className='start-workout-overview'>
        {
            workoutTemplates ? workoutTemplates.map(({ id, ...otherProps }) => <StartWorkoutItem key={id} {...otherProps} />) : '...'
        }
    </div>
)


const mapStateToProps = state => ({
    workoutTemplates: selectWorkoutTemplatesMap(state)
})

export default connect(mapStateToProps)(StartWorkoutOverview);
