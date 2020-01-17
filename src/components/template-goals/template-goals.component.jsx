import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';

import { updateDocumentInCollection } from '../../firebase/firebase.utils';

//import './template-goals.styles.scss';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';
import { updateTemplateById } from '../../redux/workout-templates/workout-templates-actions';


class TemplateGoals extends React.Component {

    constructor() {
        super();

        this.state = {
            template: null,
            goals: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.template) {
            var goals = Array.from(Object.create(props.template.exercises))
            goals.map(exercise => exercise.sets = new Array(exercise.sets).fill(0).map(() => exercise.type === 'weighted' ? ({ reps: '', weight: '' }) : ({ reps: '' })))
            console.log(props.template)
            return {
                template: props.template,
                goals: goals
            }
        }
        return null;
    }

    saveTemplate = () => {
        const goals = this.state.goals;
        this.setState({
            template: update(this.state.template, {goals: {$set: goals}})
        }, () => updateDocumentInCollection('workoutTemplates', this.state.template))
    }

    handleExerciseChange = (id, sets) => {
        const { template, goals } = this.state;
        const index = goals.indexOf(goals.find(exercise => exercise.id === id));
        this.setState({
            goals: update(this.state.goals,{[index]: {sets: {$set: sets}}})
        });
    }

    render() {
        const { goals, template } = this.state;
        return (
            <div className='workout-details'>
                <h1>{template ? template.workoutName : '...'}</h1>
                {
                    goals ? goals.map(({ id, ...otherProps }) => <WorkoutExercise key={id} id={id} onChange={this.handleExerciseChange} expanded={true} {...otherProps} />) : '...'
                }
                <div className='actions'>
                    <CustomButton onClick={this.saveTemplate} >SAVE</CustomButton>
                    <CustomButton inverted onClick={() => this.props.history.goBack()} >BACK</CustomButton>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    template: selectWorkoutTemplate(props.match.params.templateName)(state)
})

const mapDispatchToProps = dispatch => ({
    updateTemplate: id => dispatch(updateTemplateById(id))
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TemplateGoals));