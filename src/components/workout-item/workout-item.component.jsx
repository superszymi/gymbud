import React from 'react';
import { withRouter } from 'react-router-dom';

import { firestore } from '../../firebase/firebase.utils';

import CustomButton from '../custom-button/custom-button.component';

import './workout-item.styles.scss';

class WorkoutItem extends React.Component {

    deleteWorkout = async id => {
        const ref = firestore.doc(`/workouts/${id}`);
        await ref.delete();
        this.props.handleWorkoutDelete(id);
    }

    render() {
        const { workoutName, time, date, exercises, id } = this.props.workout;
        const { history } = this.props;
        return(
            <div className='workout-item'>
                <h1>{workoutName} from {date.toDate().toLocaleString().substring(0, 9)}</h1>
                <div className='buttons'>
                    <CustomButton onClick={() => history.push(`/workouts/${id}`)}>DETAILS</CustomButton>
                    <CustomButton inverted onClick={() => this.deleteWorkout(id)}>DELETE</CustomButton>
                </div>
                <div className='details'>
                    <h3>
                    {
                        exercises.find(exercise => exercise.type === 'weighted') ? 
                        <span>
                            Weights lifted: {
                                exercises.reduce((accumulator, exercise) => {
                                    if(exercise.type === 'weighted') {
                                        return accumulator + exercise.sets.reduce((accumulator, set) => {
                                            return accumulator + parseInt(set.weight !== "" ? set.weight : 0, 10)
                                        }, 0)
                                    }
                                    return accumulator
                                }, 0)
                            } kg,
                        </span> 
                    : ''
                    }
                    <span>
                        {' '}Duration: {time} min
                    </span>
                 </h3>
                </div>
            </div>
        )
    }
}

export default withRouter(WorkoutItem);