import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import { setCurrentUser } from './redux/user/user-actions';

import Header from './components/header/header.component';
import ExerciseAtlasPage from './pages/exercise-atlas/exercise-atlas.component';
import SignInSignUpPage from './pages/sign-in-sign-up/sign-in-sign-up.component';
import WorkoutCreatedPage from './pages/workout-created/workout-created.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import StartWorkoutPage from './pages/start-workout/start-workout.component';

class App extends React.Component {

  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          })
        });
      }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route path='/atlas' component={ExerciseAtlasPage} />
          <Route exact path='/sign-in' render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignInSignUpPage />)} />
          <Route exact path='/workout-created' component={WorkoutCreatedPage} />
          <Route path='/start-workout' component={StartWorkoutPage} currentUser={this.props.currentUser}/>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
