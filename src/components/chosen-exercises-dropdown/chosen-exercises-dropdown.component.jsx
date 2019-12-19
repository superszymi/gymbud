import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import CustomButton from '../custom-button/custom-button.component';
import ChosenExerciseItem from '../chosen-exercise-item/chosen-exercise-item.component';
import { toggleDropdownHidden } from '../../redux/chosen-exercises/chosen-exercises-actions';

import './chosen-exercises-dropdown.styles.scss';

const ChosenExercisesDropdown = ({ exercises, history, dispatch }) => (
    <div className='chosen-exercises-dropdown'>
        <div className='exercises'>
            {
                exercises.length ? 
                exercises.map((exercise) => <ChosenExerciseItem key={exercise.id} exercise={exercise} />)
                : <span>Add exercises from atlas</span>
            }
        </div>
        <CustomButton onClick={() => {
            history.push('/new-template');
            dispatch(toggleDropdownHidden());
            }}>PROCEED
        </CustomButton>
    </div>
)

    const mapStateToProps = ({ chosenExercises: { exercises } }) => ({
    exercises
})

export default compose(
    withRouter,
    connect(mapStateToProps)
    )(ChosenExercisesDropdown);