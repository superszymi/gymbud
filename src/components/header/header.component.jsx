import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { ReactComponent as Logo } from '../../assets/muscles.svg';
import { auth } from '../../firebase/firebase.utils';

import ChosenExercisesIcon from '../chosen-exercises-icon/chosen-exercises-icon.component';
import ChosenExercisesDropdown from '../chosen-exercises-dropdown/chosen-exercises-dropdown.component';

import './header.styles.scss';

const Header = ({ currentUser, hidden, location, history }) => (
    <div className='header'>
        <Link className='logo-container' to='/'>
            <Logo className='logo'/>
        </Link>
        <div className='options'>
            { currentUser ? (
                <div className='logged-in'>
                    <Link className='option' to='/dashboard'>
                        DASHBOARD
                    </Link>
                    <Link className='option' to='/workouts'>
                        WORKOUTS
                    </Link>
                    <Link className='option' to='/templates'>
                        TEMPLATES
                    </Link>
                    <Link className='option' to='/atlas'>
                        NEW TEMPLATE
                    </Link>
                    <Link className='option' to='/start-workout'>
                        START WORKOUT
                    </Link>
                    {
                        location.pathname.includes('atlas') ? <ChosenExercisesIcon /> : null
                    }
                </div>
            ) : null
            }
            {
                currentUser ? 
                <div className='option' onClick={async () =>  {await auth.signOut(); history.push('/');}}>SIGN OUT</div>
                :
                <Link className='option' to='/sign-in'>SIGN IN</Link>
            }
        </div>
        {
            hidden ? null : (<ChosenExercisesDropdown />)
        }
    </div>
);

const mapStateToProps = ({ user: { currentUser }, chosenExercises: { hidden } }) => ({
    currentUser,
    hidden
})

export default withRouter(connect(mapStateToProps)(Header));