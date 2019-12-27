import React from 'react';
import { connect } from 'react-redux';

import { addExerciseSet } from '../../redux/chosen-exercises/chosen-exercises-actions';

import CustomButton from '../custom-button/custom-button.component';

import './atlas-exercise-item.styles.scss';

const AtlasExerciseItem = ({ exercise, addExerciseSet }) => {
    const { name, difficulty } = exercise;
    return(
    <div className='exercise-item'>
        <h1>{name[0].toUpperCase() + name.slice(1)}</h1>
        <CustomButton onClick={() => addExerciseSet(exercise)}>ADD SET</CustomButton>
        <div className='exercise-footer'>Difficulty: {difficulty}</div>
    </div>
    );
};

const mapDispatchToProps = dispatch => ({
    addExerciseSet: exercise => dispatch(addExerciseSet(exercise))
})

export default connect(null, mapDispatchToProps)(AtlasExerciseItem);