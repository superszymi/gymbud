import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import StartWorkoutItem from '../start-workout-item/start-workout-item.component';

import { selectWorkoutTemplatesMap } from '../../redux/workout-templates/workout-templates-selectors';

import './start-workout-overview.styles.scss';
import CustomButton from '../custom-button/custom-button.component';

const StartWorkoutOverview = ({ workoutTemplates, history }) => (
    <div className='start-workout-overview'>
        <h1>Choose workout template</h1>
        <h4>Click start next to the workout you want to start</h4>
        {
            workoutTemplates ? workoutTemplates.map(({ id, ...otherProps }) => <StartWorkoutItem key={id} {...otherProps} />) : '...'
        }
        <h2>...or create a new one</h2>
        <div className='start-workout-actions'>
            <CustomButton onClick={() => history.push('/atlas')}>NEW TEMPLATE</CustomButton>
            <CustomButton inverted onClick={() => history.push('/dashboard')}>BACK</CustomButton>
        </div>
    </div>
)


const mapStateToProps = state => ({
    workoutTemplates: selectWorkoutTemplatesMap(state)
})

export default withRouter(connect(mapStateToProps)(StartWorkoutOverview));
