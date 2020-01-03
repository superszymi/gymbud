import React from 'react'

import './chosen-exercise-item.styles.scss';

const ChosenExerciseItem = ({ exercise: { name, sets, type } }) => (
    <div className='chosen-exercise-item'>
        <p className='name'>{name}</p>
        {
            type !== 'aerobic' ? 
                <p className='set-count'>{sets} {
                    sets === 1 ? 'set' : 'sets'
                }
                </p> : ''
        }
        
    </div>
)

export default ChosenExerciseItem;