import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { selectCurrentUser } from '../../redux/user/user-selectors';

import CustomButton from '../../components/custom-button/custom-button.component';

import './dashboard.styles.scss'

const DashboardPage = ({ currentUser, history }) => (
    <div className='dashboard'>
        <div className='content'>
            <div className='title'>
                <h1>
                {
                    /* currentUser ? currentUser.displayName ?  */`HELLO ${currentUser.displayName.toUpperCase()}!`/*  : '...' : '...' */
                }
                </h1>
                <h3>A great day for an outdoor run!</h3>
                <div className='action'>
                    <CustomButton onClick={() => history.push('/start-workout')}>START WORKOUT</CustomButton>
                    <span>Start one of your saved workouts</span>
                </div>
                <span>OR</span>
                <div className='action'>
                    <CustomButton onClick={() => history.push('/atlas')}>CREATE WORKOUT</CustomButton>
                    <span>Create a new reusable workout template</span>
                </div>
            </div>
        </div>
    </div>
)

/* const mapStateToProps = state => ({
    currentUser: selectCurrentUser(state)
}) */

export default withRouter(/* connect(mapStateToProps) */(DashboardPage));