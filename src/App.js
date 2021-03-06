import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import { setCurrentUser } from './redux/user/user-actions';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { selectCurrentUser } from './redux/user/user-selectors';

import WithLoading from './components/with-loading/with-loading.component';

import Header from './components/header/header.component';
import Homepage from './pages/homepage/homepage.component';
import ExerciseAtlasPage from './pages/exercise-atlas/exercise-atlas.component';
import SignInSignUpPage from './pages/sign-in-sign-up/sign-in-sign-up.component';
import StartWorkoutPage from './pages/start-workout/start-workout.component';
import DashboardPage from './pages/dashboard/dashboard.component';
import WorkoutsPage from './pages/workouts/workouts.component';
import TemplatesPage from './pages/templates/templates.component';

const DashboardPageWithLoading = WithLoading(DashboardPage);
const SignInSignUpPageWithLoading = WithLoading(SignInSignUpPage);
const HomepageWithLoading = WithLoading(Homepage);

class App extends React.Component {
  state = {
    loading: true,
    signInLoading: false,
    currentUser: null
  }

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

  static getDerivedStateFromProps(props) {
    if(props.currentUser) {
      if(props.currentUser.displayName) {
        return {
          ...props,
          loading: false
        }
      }
    }
    
    return null;
  }

  loadSignIn(arg) {
    this.setState({
      signInLoading: arg
    })
  }

  render() {
    const { loading, currentUser, signInLoading } = this.state;
    return (
      <div>
        <Switch>
          <Route exact path='/' render={() => this.props.currentUser ? (<Redirect to='/dashboard' />) : (<HomepageWithLoading isLoading={this.props.currentUser} />)} /> 
          <Route exact path='/dashboard' render={props => <DashboardPageWithLoading isLoading={loading} currentUser={currentUser} {...props} />} />
          <Route path='/atlas' render={props => <ExerciseAtlasPage currentUser={currentUser} {...props} /> } />
          <Route exact path='/sign-in' render={() => this.props.currentUser ? (<Redirect to='/dashboard' />) : (<SignInSignUpPageWithLoading isLoading={signInLoading} signingIn={arg => this.loadSignIn(arg)}/>)} />
          <Route path='/start-workout' render={props => <StartWorkoutPage currentUser={currentUser} {...props} />} />
          <Route path='/workouts' render={props => <WorkoutsPage currentUser={currentUser} {...props} />} />
          <Route path='/templates' render={props => <TemplatesPage currentUser={currentUser} {...props} />} />
        </Switch>
        
        <Header />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
