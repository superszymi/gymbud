import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase.utils';

import './header-dropdown.styles.scss';

const HeaderDropdown = ({ history, location, currentUser, clearWorkout }) => (
    <div className='header-dropdown'>
        { currentUser ? (
            <div className='dropdown-content'>
                <Link className='dropdown-option' to='/dashboard'>
                    DASHBOARD
                </Link>
                <Link className='dropdown-option' to='/workouts'>
                    WORKOUTS
                </Link>
                <Link className='dropdown-option' to='/templates'>
                    TEMPLATES
                </Link>
                <div className='dropdown-option' onClick={() => {
                    clearWorkout();
                    history.push('/atlas');
                }}>
                    NEW TEMPLATE
                </div>
                <Link className='dropdown-option' to='/start-workout'>
                    START WORKOUT
                </Link>
                <div className='dropdown-option' onClick={async () =>  {await auth.signOut(); history.push('/');}}>SIGN OUT</div>
            </div>
        ) : <div className='dropdown-content'>
                <span>Log in to access your workouts</span>
                <Link className='dropdown-option' to='/sign-in'>SIGN IN</Link>
            </div>
        }
    </div>
);

export default withRouter(HeaderDropdown);