import React from 'react';
import { connect } from 'react-redux';

import { addExerciseSet } from '../../redux/chosen-exercises/chosen-exercises-actions';

import CustomButton from '../custom-button/custom-button.component';

import './atlas-exercise-item.styles.scss';

const AtlasExerciseItem = ({ exercise, addExerciseSet }) => {
    const { name, difficulty } = exercise;
    return(
    <div className='exercise-item'>
        <div className='content'>
            <h1 className='title'>{name[0].toUpperCase() + name.slice(1)}</h1>
            <CustomButton inverted onClick={() => addExerciseSet(exercise)}>ADD SET</CustomButton>
            <div className='footer'>Difficulty: {difficulty}</div>
        </div>
    </div>
    );
};

const mapDispatchToProps = dispatch => ({
    addExerciseSet: exercise => dispatch(addExerciseSet(exercise))
})

export default connect(null, mapDispatchToProps)(AtlasExerciseItem);