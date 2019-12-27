import React from 'react';
import { connect } from 'react-redux';

import { clearExercise, addExerciseSet, removeExerciseSet } from '../../redux/chosen-exercises/chosen-exercises-actions';

import './review-template-item.styles.scss';

const ReviewTemplateItem = ({ exercise, clearExercise, addExerciseSet, removeExerciseSet }) => {
    const { name, sets } = exercise;
    return(
        <div className='review-template-item'>
            <span className='name'>{name}</span>
            <span className='sets'>
                <div className='arrow' onClick={() => removeExerciseSet(exercise)}>&#10094;</div>
                <span className='value'>{sets}</span>
                <div className='arrow' onClick={() => addExerciseSet(exercise)}>&#10095;</div></span>
            <div className='remove-button' onClick={() => clearExercise(exercise)}>&#10005;</div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    clearExercise: exercise => dispatch(clearExercise(exercise)),
    addExerciseSet: exercise => dispatch(addExerciseSet(exercise)),
    removeExerciseSet: exercise => dispatch(removeExerciseSet(exercise))
})

export default connect(null, mapDispatchToProps)(ReviewTemplateItem);