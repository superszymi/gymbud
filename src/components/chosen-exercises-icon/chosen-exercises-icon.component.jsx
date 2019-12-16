import React from 'react';
import { connect } from 'react-redux';

import { toggleDropdownHidden } from '../../redux/chosen-exercises/chosen-exercises-actions';

import { ReactComponent as ExercisesIcon } from '../../assets/dumbbell.svg';

import './chosen-exercises-icon.styles.scss';

const ChosenExercisesIcon = ({ toggleDropdownHidden, exerciseCount }) => (
    <div className='chosen-exercises-icon' onClick={toggleDropdownHidden}>
        <ExercisesIcon className='exercises-icon' />
        <span className='exercise-count'>{exerciseCount}</span>
    </div>
);

const mapDispatchToProps = dispatch => ({
    toggleDropdownHidden: () => dispatch(toggleDropdownHidden())
})

const mapStateToProps = ({ chosenExercises: { exercises }}) => ({
    exerciseCount: exercises.length
})

export default connect(mapStateToProps, mapDispatchToProps)(ChosenExercisesIcon);