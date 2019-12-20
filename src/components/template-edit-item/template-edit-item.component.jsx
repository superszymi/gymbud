import React from 'react';
import update from 'immutability-helper';

import './template-edit-item.styles.scss';

class TemplateEditItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sets: props.exercise.sets,
            name: props.exercise.name
        }
    }

    removeExerciseSet = () => {
        this.setState({
            sets: update(this.state.sets, {$set: this.state.sets - 1})
        }, () => this.props.handleExerciseChange(this.props.exercise.id, -1))
    }

    addExerciseSet = () => {
        this.setState({
            sets: update(this.state.sets, {$set: this.state.sets + 1})
        }, () => this.props.handleExerciseChange(this.props.exercise.id, 1))
    }

    clearExercise = () => {
        this.props.handleExerciseChange(this.props.exercise.id, 0)
    }

    render() {
        const { sets, name } = this.state
        return(
            <div className='template-edit-item'>
                <span className='name'>{name}</span>
                <span className='sets'>
                    <div className='arrow' onClick={() => this.removeExerciseSet()}>&#10094;</div>
                    <span className='value'>{sets}</span>
                    <div className='arrow' onClick={() => this.addExerciseSet()}>&#10095;</div></span>
                <div className='remove-button' onClick={() => this.clearExercise()}>&#10005;</div>
            </div>
        );
    }
}

export default TemplateEditItem;