import React from 'react';
import { connect } from 'react-redux';

import AtlasExerciseItem from '../atlas-exercise-item/atlas-exercise-item.component';

import { selectCategory } from '../../redux/atlas/atlas-selectors';

import './atlas-category.styles.scss';

const AtlasCategory = ({ category }) => {
    return (
        <div className='category-page'>
            <h1 className='title'>{category ? category.title.toUpperCase() : '...'}</h1>
            <div className='items'>
            {
                category ? category.exercises.map((exercise) => 
                <AtlasExerciseItem key={exercise.id} exercise={exercise} />) : '...'
            }
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    category: selectCategory(props.match.params.title)(state)
})

export default connect(mapStateToProps)(AtlasCategory);
