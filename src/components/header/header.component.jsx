import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { ReactComponent as Logo } from '../../assets/muscles.svg';
import { auth } from '../../firebase/firebase.utils';
import ChosenExercisesIcon from '../chosen-exercises-icon/chosen-exercises-icon.component';
import ChosenExercisesDropdown from '../chosen-exercises-dropdown/chosen-exercises-dropdown.component';

import './header.styles.scss';

const Header = ({ currentUser, hidden }) => (
    <div className='header'>
        <Link className='logo-container' to='/'>
            <Logo className='logo'/>
        </Link>
        <div className='options'>
            <Link className='option' to='/dashboard'>
                DASHBOARD
            </Link>
            <Link className='option' to='/workouts'>
                WORKOUTS
            </Link>
            <Link className='option' to='/new-workout'>
                NEW WORKOUT
            </Link>
            <Link className='option' to='/start-workout'>
                START WORKOUT
            </Link>
            {
                currentUser ? 
                <div className='option' onClick={() => auth.signOut()}>SIGN OUT</div>
                :
                <Link className='option' to='/sign-in'>SIGN IN</Link>
            }
            <ChosenExercisesIcon />
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

export default connect(mapStateToProps)(Header);