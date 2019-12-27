import React from 'react';
import { connect } from 'react-redux';

import { toggleDropdownHidden } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { selectChosenExercisesCount } from '../../redux/chosen-exercises/chosen-exercises-selectors';

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

const mapStateToProps = state => ({
    exerciseCount: selectChosenExercisesCount(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChosenExercisesIcon);