import React from 'react';
import { connect } from 'react-redux';

import AtlasExerciseItem from '../atlas-exercise-item/atlas-exercise-item.component';

import { selectCategory } from '../../redux/atlas/atlas-selectors';

import './atlas-category.styles.scss';

const AtlasCategory = ({ category }) => {
    return (
        <div className='atlas-category-container'>
            <h1>{category.title[0].toUpperCase() + category.title.slice(1)} exercises</h1>
            <h4>Click on the button in the exercise box to add a set of it to your workout template</h4>
            <div className='atlas-category'>
            {
                category.exercises.map((exercise) => 
                <AtlasExerciseItem key={exercise.id} exercise={exercise} />)
            }
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    category: selectCategory(props.match.params.title)(state)
})

export default connect(mapStateToProps)(AtlasCategory);
