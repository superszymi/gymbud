import React from 'react';
import update from 'immutability-helper';

import WorkoutSet from '../workout-set/workout-set.component';
import AerobicExercise from '../aerobic-exercise/aerobic-exercise.component';

import './workout-exercise.styles.scss';

class WorkoutExercise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            averageHeartRate: props.averageHeartRate,
            duration: props.duration,
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
        const { sets } = this.state;
        const { type } = this.props;
        sets ? sets.forEach(element => {
            if(type === 'weighted' ? element.reps.length && element.weight.length : element.reps.length) {
                completed++;
            }
        }) : completed = 0;
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

    handleAerobicChange = (name, value) => {
        this.setState(
            update(this.state, {[name]: {$set: value}}), () => {
                this.props.onChange(this.props.id, {name: name, value: value})
            }
        )
    }

    render() {
        const { name, type } = this.props;
        const { sets, expanded, setsCompleted, averageHeartRate, duration } = this.state;
        return (
            <div className='workout-exercise'>
                <h3>{name} { sets ? '(' + setsCompleted + '/' + sets.length + ')' : '' } {expanded ? <span className='expand-button' onClick={() => this.toggleExpand()}>&#9660;</span> : 
                    <span className='expand-button' onClick={() => this.toggleExpand()}>&#9654;</span>} </h3>
                {
                    expanded ?  (
                    sets ? sets.map((set, index) =>
                        <WorkoutSet key={index} index={index} onChange={this.handleSetChange} type={type} set={set} />
                    ) : <AerobicExercise onChange={this.handleAerobicChange} averageHeartRate={averageHeartRate} duration={duration} />) :
                    ('')
                }
            </div>
        )
    }
}

export default WorkoutExercise;