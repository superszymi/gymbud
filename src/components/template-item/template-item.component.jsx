import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { firestore } from '../../firebase/firebase.utils';

import CustomButton from '../custom-button/custom-button.component';

import './template-item.styles.scss';
import { updateExercises } from '../../redux/chosen-exercises/chosen-exercises-actions';

class TemplateItem extends React.Component {

    deleteTemplate = async id => {
        const ref = firestore.doc(`/workoutTemplates/${id}`);
        await ref.delete();
        this.props.handleTemplateDelete(id);
    }

    render() {
        const {id, workoutName, exercises, history, updateExercises } = this.props;
        return (
            <div className='template-item'>
                <h1>{workoutName ? workoutName : '...'}</h1>
                <div className='buttons'>
                    <CustomButton onClick={() => {
                            updateExercises({ id, workoutName, exercises });
                            history.push(`/templates/${workoutName}`);
                        }
                    }>DETAILS</CustomButton>
                    <CustomButton inverted onClick={() => this.deleteTemplate(id)}>DELETE</CustomButton>
                </div>
                <div className='details'>
                    <h3>Exercises: 
                        {
                            exercises ? ' ' + exercises.map(exercise => ' ' + exercise.name) : '...'
                        }
                    </h3>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateExercises: template => dispatch(updateExercises(template))
})

export default withRouter(connect(null, mapDispatchToProps)(TemplateItem));