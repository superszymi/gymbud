import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';

import { updateDocumentInCollection } from '../../firebase/firebase.utils';
import { updateTemplateById } from '../../redux/workout-templates/workout-templates-actions';
import { updateExercises } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { selectWorkoutTemplate } from '../../redux/workout-templates/workout-templates-selectors';

import FormInput from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import TemplateEditItem from '../../components/template-edit-item/template-edit-item.component';

import './template-edit.styles.scss';

class TemplateEdit extends React.Component {
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

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ template: update(this.state.template, {[name]: {$set: value}}) });
    };

    addExercises = () => {
        const { history } = this.props;
        this.updateWorkoutTemplate();
        this.props.updateExercises(this.state.template);
        history.push('/atlas');
    }

    saveAndBack = () => {
        const { history } = this.props;
        this.updateWorkoutTemplate();
        history.push('/templates');
    }

    discardAndBack = () => {
        const { history } = this.props;
        history.push('/templates');
    }

    updateWorkoutTemplate = async () => {
        const { template } = this.state;
        await updateDocumentInCollection('workoutTemplates', template);
        updateTemplateById(template);
    }

    updateExercise = (id, action) => {
        const { template } = this.state;
        const index = template.exercises.indexOf(template.exercises.find(exercise => exercise.id === id));
        switch(action) {
            case 1:
                this.setState({
                    template: update(template, {exercises: {[index]: {sets: {$apply: x => x + 1}}}})
                });
                break;
            case -1:
                this.setState({
                    template: update(template, {exercises: {[index]: {sets: {$apply: x => x - 1}}}})
                });
                break;
            case 0:
                this.setState({
                    template: update(template, {exercises: {$splice: [[index, 1]]}})
                });
                break;
            default:
                return null
        }
    }

    render() {
        const { template } = this.state;
        return (
            <div className='template-edit'>
                <FormInput required onChange={this.handleChange} name='workoutName' label='Workout name' value={template.workoutName}/>
                <div className='template-edit-header'>
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
                    template ? template.exercises.map(exercise => <TemplateEditItem key={exercise.id} exercise={exercise} handleExerciseChange={this.updateExercise} />) : '...'
                }
                <div className='total'>
                    <span>Exercises: {template ? template.exercises.length : '...'}</span>
                    <span>Total sets: {template ? template.exercises.reduce((accumulator, currentObject) =>
                        accumulator + currentObject.sets, 0) : '...'}</span>
                </div>
                <div className='actions'>
                    <div className='action'>
                        <CustomButton onClick={() => this.addExercises()}>ADD EXERCISES</CustomButton>
                        <span>Add more exercises to the template</span>
                    </div>
                    <div className='action'>
                        <CustomButton onClick={() => this.saveAndBack()}>SAVE WORKOUT</CustomButton>
                        <span>Save template and go back to templates</span>
                    </div>
                    <div className='action'>
                        <CustomButton onClick={() => this.discardAndBack()}>DISCARD</CustomButton>
                        <span>Discard template and go back to templates</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    template: selectWorkoutTemplate(props.match.params.templateName)(state)
})

const mapDispatchToProps = dispatch => ({
    updateTemplateById: template => dispatch(updateTemplateById(template)),
    updateExercises: exercises => dispatch(updateExercises(exercises))
})

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(TemplateEdit);