import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import CustomButton from '../custom-button/custom-button.component';
import ChosenExerciseItem from '../chosen-exercise-item/chosen-exercise-item.component';

import { toggleDropdownHidden, clearWorkout } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { selectChosenExercisesItems } from '../../redux/chosen-exercises/chosen-exercises-selectors';

import './chosen-exercises-dropdown.styles.scss';

const ChosenExercisesDropdown = ({ exercises, history, location, dispatch }) => (
    <div className='chosen-exercises-dropdown'>
        <div className='exercises'>
            {
                exercises.length ? 
                exercises.map((exercise) => <ChosenExerciseItem key={exercise.id} exercise={exercise} />)
                : <span>Add exercises from atlas</span>
            }
        </div>
        <CustomButton onClick={() => {
            dispatch(toggleDropdownHidden());
            console.log(location)
            history.push("/atlas/review-template")
            }}>PROCEED
        </CustomButton>
        <CustomButton inverted onClick={() => {
            dispatch(clearWorkout());
            dispatch(toggleDropdownHidden());
            }}>CLEAR
        </CustomButton>
    </div>
)

const mapStateToProps = state => ({
    exercises: selectChosenExercisesItems(state)
})

export default compose(
    withRouter,
    connect(mapStateToProps)
    )(ChosenExercisesDropdown);