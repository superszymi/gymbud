import React from 'react';

import FormInput from '../form-input/form-input.component';

import './aerobic-exercise.styles.scss';

class AerobicExercise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            averageHeartRate : props.averageHeartRate ? props.averageHeartRate : '',
            duration: props.duration ? props.duration : ''
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value }, this.props.onChange(name, value));
    }

    render() {
        return(
            <div className='aerobic-exercise'>
                <div className='aerobic-exercise-input'>
                    <FormInput type='number' value={this.state.averageHeartRate} onChange={this.handleChange} name='averageHeartRate' label='Heart rate' />
                </div>
                <div className='aerobic-exercise-input'>
                    <FormInput type='number' value={this.state.duration} onChange={this.handleChange} name='duration' label='Duration' />
                </div>
            </div>
        )
    }
}

export default AerobicExercise;