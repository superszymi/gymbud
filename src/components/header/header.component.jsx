import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { ReactComponent as Logo } from '../../assets/muscles.svg';
import { auth } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user-selectors';
import { clearWorkout, hideDropdown } from '../../redux/chosen-exercises/chosen-exercises-actions';

import ChosenExercisesIcon from '../chosen-exercises-icon/chosen-exercises-icon.component';
import ChosenExercisesDropdown from '../chosen-exercises-dropdown/chosen-exercises-dropdown.component';
import HeaderDropdown from '../header-dropdown/header-dropdown.component';

import './header.styles.scss';

class Header extends React.Component {
    constructor() {
        super();

        this.state = {
            width: window.innerWidth,
            showItems: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.setState({
                showItems: false
            })
            this.props.hideDropdown();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({
            width: window.innerWidth,
            showItems: window.innerWidth >= 940 ? false : this.state.showItems
        })
    }

    toggleItems = () => {
        this.setState({
            showItems: !this.state.showItems
        })
    }

    render() {
        const { currentUser, location, history, clearWorkout, hidden } = this.props;
        return (
            <div className='header'>
                <Link className='logo-container' to='/'>
                    <Logo className='header-logo'/>
                </Link>
                {
                    this.state.width <= 940 ? 
                        <div className='options' >
                            {
                                location.pathname.includes('atlas') && !location.pathname.includes('review') ? <ChosenExercisesIcon /> : null
                            }
                            <span className='toggle-items-button' onClick={this.toggleItems}>&#8801;</span>
                        </div>
                        : 
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
                                <div className='option' onClick={() => {
                                    clearWorkout();
                                    history.push('/atlas');
                                }}>
                                    NEW TEMPLATE
                                </div>
                                <Link className='option' to='/start-workout'>
                                    START WORKOUT
                                </Link>
                                {
                                    location.pathname.includes('atlas') && !location.pathname.includes('review') ? <ChosenExercisesIcon /> : null
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
                }
                {
                    this.state.showItems ? (<HeaderDropdown currentUser={currentUser} clearWorkout={clearWorkout} />) : null
                }
                {
                    hidden ? null : (<ChosenExercisesDropdown offset={this.state.showItems} />)
                }
            </div>
        )
    }
    
};

const mapStateToProps = state => ({
    currentUser: selectCurrentUser(state),
    hidden: state.chosenExercises.hidden
});

const mapDispatchToProps = dispatch => ({
    clearWorkout: () => dispatch(clearWorkout()),
    hideDropdown: () => dispatch(hideDropdown())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));