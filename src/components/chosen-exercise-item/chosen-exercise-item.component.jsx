import React from 'react'

import './chosen-exercise-item.styles.scss';

const ChosenExerciseItem = ({ exercise: { name, sets } }) => (
    <div className='chosen-exercise-item'>
        <p className='name'>{name}</p>
        <p className='set-count'>{sets} {
            sets === 1 ? 'set' : 'sets'
        }
        </p>
    </div>
)

export default ChosenExerciseItem;