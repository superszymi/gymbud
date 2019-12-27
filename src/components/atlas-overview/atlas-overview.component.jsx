import React from 'react';
import { connect } from 'react-redux';

import AtlasCategoryItem from '../atlas-category-item/atlas-category-item.component';

import { selectCategoriesMap } from '../../redux/atlas/atlas-selectors';

import './atlas-overview.styles.scss';

const AtlasOverview = ({ categories }) => (
    <div className='atlas-overview-container'>
        <h1>Find your exercise</h1>
        <h4>Choose a body part to view exercises that train it</h4>
        <div className='atlas-overview'>
            {
                categories.map(({ id, ...otherProps }) => (
                    <AtlasCategoryItem key={id} {...otherProps} />
                ))
            }
        </div>
    </div>
    
)

const mapStateToProps = state => ({
    categories: selectCategoriesMap(state)
})

export default connect(mapStateToProps)(AtlasOverview);