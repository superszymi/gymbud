import React from 'react';
import { connect } from 'react-redux';

import FormInput from '../../components/form-input/form-input.component';

import WorkoutCreatedItem from '../../components/workout-created-item/workout-created-item.component';

import './workout-created.styles.scss';

const WorkoutCreatedPage = ({ exercises, totalExercises, totalSets }) => (
    <div className='workout-created-page'>
        <form /*onSubmit={this.handleSubmit}*/ className='name-input'>
            <FormInput /*onChange={this.handleChange}*/name='name' label='Workout name' value=''/>
        </form>
        <div className='workout-created-header'>
            <div className='header-block'>
                <span>Exercise</span>
            </div>
            <div className='header-block'>
                <span>Sets</span>
            </div>
            <div className='header-block'>
                <span>Actions</span>
            </div>
        </div>
        {
            exercises.map(exercise => <WorkoutCreatedItem key={exercise.id} exercise={exercise} />)
        }
        <div className='total'>
            <span>Exercises: {totalExercises}</span>
            <span>Total sets: {totalSets}</span>
        </div>
    </div>
)

const mapStateToProps = ({ chosenExercises: { exercises } }) => ({
    exercises,
    totalExercises: exercises.length,
    totalSets: exercises.reduce((accumulator, currentObject) => 
        accumulator + currentObject.sets, 0)
})

export default connect(mapStateToProps)(WorkoutCreatedPage);