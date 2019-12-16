import React from 'react';
import { connect } from 'react-redux';

import AtlasCategoryItem from '../atlas-category-item/atlas-category-item.component';

import './atlas-overview.styles.scss';

const AtlasOverview = ({ categories }) => (
    <div className='category-overview'>
        {
            categories.map(({ id, ...otherProps }) => (
                <AtlasCategoryItem key={id} {...otherProps} />
            ))
        }
    </div>
)

const mapStateToProps = state => ({
    categories: state.atlas.categories
})

export default connect(mapStateToProps)(AtlasOverview);