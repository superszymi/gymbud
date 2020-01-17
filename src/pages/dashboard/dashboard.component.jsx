import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CustomButton from '../../components/custom-button/custom-button.component';

import { clearWorkout } from '../../redux/chosen-exercises/chosen-exercises-actions';
import { firestore, convertWorkoutsSnapshotToMap } from '../../firebase/firebase.utils';

import './dashboard.styles.scss'

class DashboardPage extends React.Component { 
    state = {
        insight: ''
    }

    componentDidMount() {
      this.getLastWorkouts();
    }

    componentDidUpdate(prevProps) {
      if(prevProps.currentUser !== this.props.currentUser) this.getLastWorkouts();
    }

    getMessages(workoutsMap) {
        const workouts = Object.keys(workoutsMap).map(key => workoutsMap[key]);
        if (workouts.length) {
          var messages = []
          if(!workouts.find(workout => workout.exercises.find(exercise => exercise.type === 'aerobic')) && workouts.length > 4) {
            messages.push('You haven\'t done any aerobic exercises lately.|Aerobic exercises have positive influence on your endurance and help you lose fat. Consider adding some cardio to your next workouts')
          }
          if(workouts[0].time > 90) {
            if(workouts.slice(1).filter(workout => workout.time > 90).length > 2) {
              messages.push('Your workouts have been taking a long time lately.|Continuous workouts exceeding 90 minutes can lead to overtraining. Perhaps remove some sets or shorten the cardio?')
            } else {
              messages.push('Your latest workout was pretty long!|Try to keep your workouts\' duration under 90 minutes to avoid overtraining')
            }
          }
          if(workouts[0].exercises.find(exercise => exercise.type === 'aerobic' && exercise.averageHeartRate > 160 && exercise.duration > 30)) {
            messages.push('You kept high heart rate for a long time during your last aerobic exercise.|If you maintain high intensity of the exercise, remember to shorten the workout accordingly')
          }
          if(workouts[0].exercises.find(exercise => exercise.type === 'aerobic' && exercise.averageHeartRate < 120)) {
            messages.push('Your heart rate during latest aerobic exercise was low.|Did you go easy on yourself? Try to keep your heart rate above 120bpm during aerobic exercises')
          }
          if(workouts.length > 1 && workouts[0].exercises.reduce((accumulator, exercise) => {
            if(exercise.type === 'weighted') {
                return accumulator + exercise.sets.reduce((accumulator, set) => {
                    return accumulator + parseInt(set.weight !== 0 && set.reps !== 0 ? set.weight * set.reps : 0, 10)
                }, 0)
              }
              return accumulator
            }, 0)
            > 
            Math.max.apply(null, workouts.slice(1).map(workout => workout.exercises.reduce((accumulator, exercise) => {
              if(exercise.type === 'weighted') {
                  return accumulator + exercise.sets.reduce((accumulator, set) => {
                      return accumulator + parseInt(set.weight !== 0 && set.reps !== 0 ? set.weight * set.reps : 0, 10)
                  }, 0)
                }
                return accumulator
              }, 0)))) {
                    messages.push(`Congratulations, you've lifted more kilograms during your latest workout than during your previous ones!|Remember you should increase weights gradually though`)
          }
        this.setState({
          insight: messages[Math.floor(Math.random()*messages.length)]
        })
        }
      }
    
      getLastWorkouts() {
        if(this.props.currentUser) {
          const workoutsRef = firestore.collection('workouts').where('user', '==', firestore.doc(`/users/${this.props.currentUser.id}`)).orderBy('date', 'desc').limit(10);
            workoutsRef.get().then(snapshot => {
            const workoutsMap = convertWorkoutsSnapshotToMap(snapshot);
            this.getMessages(workoutsMap);
          });
        }
      }

    render() { 
        const { currentUser, history, clearWorkout } = this.props;
        const { insight } = this.state;
        return (
            <div className='dashboard'>
                <div className='content'>
                    <div className='title'>
                        <h1>
                        {
                            `HELLO, ${currentUser.displayName.toUpperCase()}!`
                        }
                        </h1>
                        <div className='action'>
                            <CustomButton onClick={() => history.push('/start-workout')}>START WORKOUT</CustomButton>
                            <span>Start one of your saved workouts</span>
                        </div>
                        <span className='or'>OR</span>
                        <div className='action'>
                            <CustomButton onClick={() => {
                                    clearWorkout();
                                    history.push('/atlas');
                                }
                            }>CREATE WORKOUT</CustomButton>
                            <span>Create a new reusable workout template</span>
                        </div>
                    </div>
                    <div className='insights'>
                        <h2>{insight ? insight.substring(0, insight.indexOf('|')) : ''}</h2>
                        <h4>{insight ? insight.substring(insight.indexOf('|') + 1) : ''}</h4>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    clearWorkout: () => dispatch(clearWorkout())
})

export default withRouter(connect(null, mapDispatchToProps)(DashboardPage));