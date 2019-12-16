import React from 'react';
import { connect } from 'react-redux';

import AtlasExerciseItem from '../../components/atlas-exercise-item/atlas-exercise-item.component';

import './atlas-category.styles.scss';

const AtlasCategoryPage = ({ category }) => (
    <div className='category-page'>
        <h1 className='title'>{category.title.toUpperCase()}</h1>
        <div className='items'>
        {
            category.exercises.map((exercise) => 
            <AtlasExerciseItem key={exercise.id} exercise={exercise} />)
        }
        </div>
    </div>
)

const mapStateToProps = (state, props) => ({
    category: state.atlas.categories.find(category => props.match.params.title === category.title)
})

export default connect(mapStateToProps)(AtlasCategoryPage);
