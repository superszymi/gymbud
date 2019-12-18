import React from 'react';
import { connect } from 'react-redux';

import AtlasExerciseItem from '../../components/atlas-exercise-item/atlas-exercise-item.component';

import './atlas-category.styles.scss';

const AtlasCategoryPage = ({ category }) => {
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

const mapStateToProps = ({ atlas: { categories } }, props) => ({
    category: categories ? Object.keys(categories).map(key => categories[key]).find(category => category.routeName === props.match.params.title) : null
})

export default connect(mapStateToProps)(AtlasCategoryPage);
