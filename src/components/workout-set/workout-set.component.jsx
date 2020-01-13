import React from 'react';

import FormInput from '../form-input/form-input.component';

import './workout-set.styles.scss';

class WorkoutSet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reps: props.set.reps ? props.set.reps : '0',
            weight: props.set.weight ? props.set.weight : '0'
        }
    }

    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value }, this.props.onChange(this.props.index, name, value));
    }

    render() {
        return (
            <div className='workout-set'>
                <h3 className='set-number'>{this.props.index + 1}</h3>
                <div className='set-input'>
                    <FormInput type='number' value={this.state.reps} onChange={this.handleChange} name='reps' label='Reps' />
                </div>
                {
                    this.props.type === 'weighted' ? 
                        <div className='set-input'>
                            <FormInput type='number' value={this.state.weight} onChange={this.handleChange} name='weight' label='Weight'/>
                        </div> : ''
                }
            </div>
        )
    }
}

export default WorkoutSet;