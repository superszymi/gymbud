import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase.utils';

const HeaderDropdown = ({ history, location, currentUser, clearWorkout }) => (
    <div className='header-dropdown'>
        { currentUser ? (
            <div className='dropdown-logged-in'>
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
            </div>
        ) : <div>Log in to access your workouts</div>
        }
        {
            currentUser ? 
            <div className='dropdown-option' onClick={async () =>  {await auth.signOut(); history.push('/');}}>SIGN OUT</div>
            :
            <Link className='dropdown-option' to='/sign-in'>SIGN IN</Link>
        }
    </div>
);

export default withRouter(HeaderDropdown);