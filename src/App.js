import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import { setCurrentUser } from './redux/user/user-actions';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

import Header from './components/header/header.component';
import Homepage from './pages/homepage/homepage.component';
import ExerciseAtlasPage from './pages/exercise-atlas/exercise-atlas.component';
import SignInSignUpPage from './pages/sign-in-sign-up/sign-in-sign-up.component';
import WorkoutCreatedPage from './pages/workout-created/workout-created.component';
import StartWorkoutPage from './pages/start-workout/start-workout.component';
import DashboardPage from './pages/dashboard/dashboard.component';
import WorkoutsPage from './pages/workouts/workouts.component';
import TemplatesPage from './pages/templates/templates.component';


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
          <Route exact path='/' render={() => this.props.currentUser ? (<Redirect to='/dashboard' />) : (<Homepage />)} /> 
          <Route exact path='/dashboard' component={DashboardPage} />
          <Route path='/atlas' component={ExerciseAtlasPage} />
          <Route exact path='/sign-in' render={() => this.props.currentUser ? (<Redirect to='/dashboard' />) : (<SignInSignUpPage />)} />
          <Route exact path='/new-template' component={WorkoutCreatedPage} />
          <Route path='/start-workout' component={StartWorkoutPage} />
          <Route path='/workouts' component={WorkoutsPage} />
          <Route path='/templates' component={TemplatesPage} />
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
