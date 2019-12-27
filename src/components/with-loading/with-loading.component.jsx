import React from 'react';

import './with-loading.styles.scss';

const WithLoading = WrappedComponent => {
    const Loading = ({ isLoading, ...props }) => {
        return isLoading ? (
            <div className='lds-container'>
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            
        ) : (
            <WrappedComponent {...props} />
        );
    }
    return Loading;
}

export default WithLoading;