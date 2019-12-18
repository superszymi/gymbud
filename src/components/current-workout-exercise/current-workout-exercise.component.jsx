import React from 'react';
import update from 'immutability-helper';

import CurrentWorkoutSet from '../current-workout-set/current-workout-set.component';

class CurrentWorkoutExercise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sets: props.sets
        }
    }

    handleSetChange = (index, name, value) => {
        this.setState(
            update(this.state, {sets: {[index]: {[name]: {$set: value} }}}), () => this.props.onChange(this.props.id, this.state.sets)
        );
    }

    render() {
        const { name, sets } = this.props;
        return (
            <div>
                <h3>{name}</h3>
                {
                    sets ? sets.map((set, index) =>
                        <CurrentWorkoutSet key={index} index={index} onChange={this.handleSetChange} set={set} />
                    ) : '...'
                }
            </div>
        )
    }
}

export default CurrentWorkoutExercise;