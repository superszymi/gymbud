import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { firestore, addDocumentToCollection } from '../../firebase/firebase.utils';
import { clearWorkout } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { selectChosenExercisesItems, selectChosenExercisesWorkoutName, selectChosenExercisesCount, selectChosenExercisesSetCount } from '../../redux/chosen-exercises/chosen-exercises-selectors';

import FormInput from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import WorkoutCreatedItem from '../../components/workout-created-item/workout-created-item.component';

import './workout-created.styles.scss';

class WorkoutCreatedPage extends React.Component {
    constructor() {
        super();

        this.state = {
            ...this.state,
            workoutName: ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.workoutName && props.workoutName !== state.workoutName) {
            return props;
        }
        return null;
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value });
    };

    saveAndStart = () => {
        const { history } = this.props;
        const { workoutName } = this.state;
        this.addWorkoutTemplate();
        history.push(`/start-workout/${workoutName}`);
    }

    saveAndBack = () => {
        const { history } = this.props;
        this.addWorkoutTemplate();
        history.push('/dashboard');
    }

    discardAndBack = () => {
        const { history, clearWorkout } = this.props;
        clearWorkout();
        history.push('/dashboard');
    }

    addWorkoutTemplate = () => {
        const { currentUser, chosenExercises } = this.props;
        const { workoutName } = this.state;

        const exercises = chosenExercises.map(({name, sets, id}) => ({name, sets, id}));
        const user = firestore.doc(`/users/${currentUser.id}`)

        addDocumentToCollection('workoutTemplates', { workoutName, user, exercises });
    }

    render() {
        const { chosenExercises, totalExercises, totalSets } = this.props;
        return (
            <div className='workout-created-page'>
                <FormInput required onChange={this.handleChange} name='workoutName' label='Workout name' value={this.state.workoutName}/>
                <div className='workout-created-header'>
                    <div className='header-block'>
                        <span>Exercise</span>
                    </div>
                    <div className='header-block'>
                        <span>Sets</span>
                    </div>
                    <div className='header-block'>
                        <span>Actions</span>
                    </div>
                </div>
                {
                    chosenExercises.map(exercise => <WorkoutCreatedItem key={exercise.id} exercise={exercise} />)
                }
                <div className='total'>
                    <span>Exercises: {totalExercises}</span>
                    <span>Total sets: {totalSets}</span>
                </div>
                <div className='actions'>
                    <div className='action'>
                        <CustomButton onClick={() => this.saveAndStart()}>START WORKOUT</CustomButton>
                        <span>Save template and start workout now</span>
                    </div>
                    <div className='action'>
                        <CustomButton onClick={() => this.saveAndBack()}>SAVE WORKOUT</CustomButton>
                        <span>Save template and go back to dashboard</span>
                    </div>
                    <div className='action'>
                        <CustomButton onClick={() => this.discardAndBack()}>DISCARD</CustomButton>
                        <span>Discard template and go back to dashboard</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    chosenExercises: selectChosenExercisesItems(state),
    workoutName: selectChosenExercisesWorkoutName(state),
    totalExercises: selectChosenExercisesCount(state),
    totalSets: selectChosenExercisesSetCount(state)
})

const mapDispatchToProps = dispatch => ({
    clearWorkout: () => dispatch(clearWorkout())
})

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(WorkoutCreatedPage);