import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CustomButton from '../../components/custom-button/custom-button.component';

import { clearWorkout } from '../../redux/chosen-exercises/chosen-exercises-actions';

import './dashboard.styles.scss'

const DashboardPage = ({ currentUser, history, clearWorkout }) => (
    <div className='dashboard'>
        <div className='content'>
            <div className='title'>
                <h1>
                {
                    `HELLO ${currentUser.displayName.toUpperCase()}!`
                }
                </h1>
                <h3>A great day for an outdoor run!</h3>
                <div className='action'>
                    <CustomButton onClick={() => history.push('/start-workout')}>START WORKOUT</CustomButton>
                    <span>Start one of your saved workouts</span>
                </div>
                <span>OR</span>
                <div className='action'>
                    <CustomButton onClick={() => {
                            clearWorkout();
                            history.push('/atlas');
                        }
                    }>CREATE WORKOUT</CustomButton>
                    <span>Create a new reusable workout template</span>
                </div>
            </div>
        </div>
    </div>
);

const mapDispatchToProps = dispatch => ({
    clearWorkout: () => dispatch(clearWorkout())
})

export default withRouter(connect(null, mapDispatchToProps)(DashboardPage));