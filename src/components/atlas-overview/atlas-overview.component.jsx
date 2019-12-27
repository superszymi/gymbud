import React from 'react';
import { connect } from 'react-redux';

import AtlasCategoryItem from '../atlas-category-item/atlas-category-item.component';

import { selectCategoriesMap } from '../../redux/atlas/atlas-selectors';

import './atlas-overview.styles.scss';

const AtlasOverview = ({ categories }) => (
    <div className='atlas-overview'>
        {
            categories.map(({ id, ...otherProps }) => (
                <AtlasCategoryItem key={id} {...otherProps} />
            ))
        }
    </div>
)

const mapStateToProps = state => ({
    categories: selectCategoriesMap(state)
})

export default connect(mapStateToProps)(AtlasOverview);