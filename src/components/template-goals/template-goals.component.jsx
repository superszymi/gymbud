import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import update from 'immutability-helper';

import WorkoutExercise from '../workout-exercise/workout-exercise.component';
import CustomButton from '../custom-button/custom-button.component';

import { updateDocumentInCollection } from '../../firebase/firebase.utils';
import { updateTemplateById } from '../../redux/workout-templates/workout-templates-actions';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';


class TemplateGoals extends React.Component {

    constructor() {
        super();

        this.state = {
            template: null
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.template && props.updateTemplateById && !state.template) {
            return props;
        }
        return null;
    }

    saveTemplate = () => {
        const { template } = this.state;
        updateDocumentInCollection('workoutTemplates', template);
        this.props.updateTemplateById(template);
        this.props.history.push('/templates')
    }

    handleExerciseChange = (id, sets) => {
        const { template } = this.state;
        const { exercises } = template;
        var type = ''
        const index = exercises.indexOf(exercises.find(exercise => {type = exercise.type; return exercise.id === id;}));
        if(type === 'aerobic') {
            var exercise = exercises[index];
            exercise.averageHeartRate = sets.averageHeartRate;
            exercise.duration = sets.duration;

            this.setState({
                template: update(template, {exercises: {[index]: {$set: exercise}}})
            })
        } else {
            this.setState({
                template: update(template, {exercises: {[index]: {goals: {$set: sets}}}})
            });
        }
    }

    render() {
        const { template } = this.state;
        return (
            <div className='workout-details'>
                <h1>{template ? template.workoutName : '...'}</h1>
                {
                    template ? template.exercises.map(({ id, goals, type, sets, ...otherProps }) => 
                        <WorkoutExercise key={id} id={id} type={type} sets={type === 'aerobic' ? null : goals} 
                            averageHeartRate={type === 'aerobic' && goals.averageHeartRate ? goals.averageHeartRate : null} 
                            duration={type === 'aerobic' && goals.duration ? goals.duration : null} onChange={this.handleExerciseChange} 
                            expanded={true} {...otherProps} />) 
                    : '...'
                }
                <div className='actions'>
                    <CustomButton onClick={this.saveTemplate} >SAVE</CustomButton>
                    <CustomButton inverted onClick={() => this.props.history.push('/templates')} >BACK</CustomButton>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    template: selectWorkoutTemplate(props.match.params.templateName)(state)
})

const mapDispatchToProps = dispatch => ({
    updateTemplateById: template => dispatch(updateTemplateById(template))
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TemplateGoals));