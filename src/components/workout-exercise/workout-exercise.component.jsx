import React from 'react';
import update from 'immutability-helper';

import WorkoutSet from '../workout-set/workout-set.component';

class WorkoutExercise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sets: props.sets
        }
    }

    handleSetChange = (index, name, value) => {
        this.setState({
            sets: update(this.state.sets, {[index]: {[name]: {$set: value} }})},
            () => this.props.onChange(this.props.id, this.state.sets)
        );
    }

    render() {
        const { name, sets } = this.props;
        return (
            <div>
                <h3>{name}</h3>
                {
                    sets ? sets.map((set, index) =>
                        <WorkoutSet key={index} index={index} onChange={this.handleSetChange} set={set} />
                    ) : '...'
                }
            </div>
        )
    }
}

export default WorkoutExercise;