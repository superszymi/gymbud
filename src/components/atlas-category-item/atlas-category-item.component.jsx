import React from 'react';
import { withRouter } from 'react-router-dom';

import './atlas-category-item.styles.scss';

const AtlasCategoryItem = ({ title, history, match, routeName }) => (
    <div className='category-item' onClick={() => history.push(`${match.url}/${routeName}`)}>
        <div className='content'>
            <h1 className='title'>{title.toUpperCase()}</h1>
        </div>
    </div>
);

export default withRouter(AtlasCategoryItem);