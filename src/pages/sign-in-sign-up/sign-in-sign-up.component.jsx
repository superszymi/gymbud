import React from 'react';

import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';

import './sign-in-sign-up.styles.scss';

const SignInSignUpPage = ({signingIn}) => (
  <div className='sign-in-sign-up'>
    <SignIn onSignIn={arg => signingIn(arg)}/>
    <SignUp />
  </div>
);

export default SignInSignUpPage;