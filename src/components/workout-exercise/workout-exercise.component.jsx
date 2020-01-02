import React from 'react';
import update from 'immutability-helper';

import WorkoutSet from '../workout-set/workout-set.component';

import './workout-exercise.styles.scss';

class WorkoutExercise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sets: props.sets,
            expanded: props.expanded,
            setsCompleted: 0
        }
    }

    componentDidMount() {
        this.updateCompletedSets();
    }

    toggleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    updateCompletedSets = () => {
        var completed = 0;
        this.state.sets.forEach(element => {
            if(element.reps.length && element.weight.length) {
                completed++;
            }
        });
        this.setState(
            update(this.state, {setsCompleted: {$set: completed}})
        )
    }

    handleSetChange = (index, name, value) => {
        this.setState(
            update(this.state, {sets: {[index]: {[name]: {$set: value} }}}), () => {
                this.props.onChange(this.props.id, this.state.sets);
                this.updateCompletedSets();
            }
        );
    }

    render() {
        const { name } = this.props;
        const { sets, expanded, setsCompleted } = this.state;
        return (
            <div>
                <h3>{name} {'(' + setsCompleted + '/' + sets.length + ')'} {expanded ? <span className='expand-button' onClick={() => this.toggleExpand()}>&#9660;</span> : 
                    <span className='expand-button' onClick={() => this.toggleExpand()}>&#9654;</span>} </h3>
                {
                    expanded ?  (
                    sets ? sets.map((set, index) =>
                        <WorkoutSet key={index} index={index} onChange={this.handleSetChange} set={set} />
                    ) : '...') :
                    ('')
                }
            </div>
        )
    }
}

export default WorkoutExercise;