import React from 'react';

import FormInput from '../form-input/form-input.component';

class CurrentWorkoutSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reps: '',
            weight: ''
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value }, this.props.onChange(this.props.index, name, value));
    }

    render() {
        return (
            <div>
                <FormInput value={this.state.reps} onChange={this.handleChange} name='reps' label='Reps' />
                <FormInput value={this.state.weight} onChange={this.handleChange} name='weight' label='Weight'/>
            </div>
        )
    }
}

export default CurrentWorkoutSet;