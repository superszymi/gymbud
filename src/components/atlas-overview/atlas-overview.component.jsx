import React from 'react';
import { connect } from 'react-redux';

import AtlasCategoryItem from '../atlas-category-item/atlas-category-item.component';

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

const mapStateToProps = ({ atlas: { categories }}) => ({
    categories: categories ? Object.keys(categories).map(key => categories[key]) : []
})

export default connect(mapStateToProps)(AtlasOverview);