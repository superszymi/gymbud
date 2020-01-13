import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { firestore, addDocumentToCollection, updateDocumentInCollection } from '../../firebase/firebase.utils';
import { clearWorkout, updateExercises } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { selectChosenExercisesId, selectChosenExercisesItems, selectChosenExercisesWorkoutName, selectChosenExercisesCount, selectChosenExercisesSetCount } from '../../redux/chosen-exercises/chosen-exercises-selectors';
import { selectCurrentUser } from '../../redux/user/user-selectors';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import ReviewTemplateItem from '../review-template-item/review-template-item.component';

import './review-template.styles.scss';

class ReviewTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            workoutName: '',
            exercises: null,
            start: null,
            noExercises: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.exercises && props.exercises !== state.exercises) {
            if(!state.workoutName) {
                return props
            }
            return ({
                exercises: props.exercises
            })
        }
        return null;
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ 
            [name]: value
         });
    };

    deleteExercise = exerciseToDelete => {
        this.setState({
            exercises: this.state.exercises.filter(exercise => exercise.id === exerciseToDelete.id)
        })
    }

    addExercises = async () => {
        const { history, updateExercises } = this.props;
        const { id, workoutName, exercises } = this.state;
        updateExercises({ id, workoutName, exercises })
        history.push('/atlas');
    }

    saveAndStart = () => {
        const { history } = this.props;
        const { workoutName } = this.state;
        this.addWorkoutTemplate();
        history.push(`/start-workout/${workoutName}`);
    }

    saveAndBack = () => {
        const { history } = this.props;
        this.addWorkoutTemplate();
        history.push('/templates');
    }

    discardAndBack = () => {
        const { history, clearWorkout } = this.props;
        clearWorkout();
        history.goBack();
    }

    addWorkoutTemplate = () => {
        const { exercises, id, workoutName } = this.state;
        const user = firestore.doc(`/users/${this.props.currentUser.id}`);
        const chosenExercises = exercises.map(({name, sets, type, id}) => sets ? ({name, sets, type, id}) : ({name, type, id}));
        console.log(chosenExercises);
        id ? updateDocumentInCollection('workoutTemplates', { exercises: chosenExercises, user, workoutName, id }) : addDocumentToCollection('workoutTemplates', { exercises: chosenExercises, user, workoutName });   
    }

    handleSubmit = event => {
        event.preventDefault();
        if(!this.state.exercises.length) {
            this.setState({noExercises: true});
            return null;
        }
        if(this.state.start === true) {
            this.saveAndStart()
        } else if (this.state.start === false) {
            this.saveAndBack()
        }
    }

    render() {
        const { exercises, totalExercises, totalSets, noExercises } = this.state;
        return (
            <div>
                {
                    noExercises ? 
                    <div className='review-popup'>
                        <div className='review-popup-inner'>
                            <h3>Workout must have at least one exercise!</h3>
                            <CustomButton onClick={() => this.setState({noExercises: false})}>OK</CustomButton>
                        </div>
                    </div> : 
                    <div className='review-template'>
                        <form onSubmit={this.handleSubmit} id="review-template-form">
                            <FormInput required onChange={this.handleChange} name='workoutName' label='Workout name' value={this.state.workoutName}/>
                        </form>
                        <div className='review-template-header'>
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
                            exercises.map((exercise, index) => <ReviewTemplateItem key={exercise.type === 'aerobic' ? exercise.id + index : exercise.id} exercise={exercise} />)
                        }
                        <div className='total'>
                            <span>Exercises: {totalExercises}</span>
                            <span>Total sets: {totalSets}</span>
                        </div>
                        <div className='actions'>
                            <div className='action'>
                                <CustomButton onClick={() => this.addExercises()}>ADD EXERCISES</CustomButton>
                                <span>Add more exercises to the template</span>
                            </div>
                            <div className='action'>
                                <CustomButton type='submit' form='review-template-form' onClick={() => this.setState({start: true})}>START WORKOUT</CustomButton>
                                <span>Save template and start workout now</span>
                            </div>
                            <div className='action'>
                                <CustomButton type='submit' form='review-template-form' onClick={() => this.setState({start: false})}>SAVE WORKOUT</CustomButton>
                                <span>Save template and go back</span>
                            </div>
                            <div className='action'>
                                <CustomButton inverted onClick={() => this.discardAndBack()}>DISCARD</CustomButton>
                                <span>Discard changes and go back</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    exercises: selectChosenExercisesItems(state),
    workoutName: selectChosenExercisesWorkoutName(state),
    totalExercises: selectChosenExercisesCount(state),
    totalSets: selectChosenExercisesSetCount(state),
    id: selectChosenExercisesId(state),
    currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = dispatch => ({
    clearWorkout: () => dispatch(clearWorkout()),
    updateExercises: exercises => dispatch(updateExercises(exercises))
})

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(ReviewTemplate);