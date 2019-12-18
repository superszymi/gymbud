import React from 'react';
import { withRouter } from 'react-router-dom'

import CustomButton from '../../components/custom-button/custom-button.component';

import './homepage.styles.scss';

export const Homepage = ({ history }) => (
    <div className='homepage'>
        <div className='title'>
            <h1>WELCOME TO GYMBUD</h1>
            <h3>THE PROGRESSIVE WEB APP FOR MANAGING YOUR WORKOUTS!</h3>
        </div>
        <div className='actions'>
            <h3>CREATE ACCOUNT OR SIGN IN</h3>
            <CustomButton onClick={() => history.push('/sign-in')}>SIGN IN</CustomButton>
        </div>
    </div>
)

export default withRouter(Homepage);