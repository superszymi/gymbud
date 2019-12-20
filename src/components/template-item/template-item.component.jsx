import React from 'react';
import { withRouter } from 'react-router-dom';

import { firestore } from '../../firebase/firebase.utils';

import CustomButton from '../custom-button/custom-button.component';

import './template-item.styles.scss';

class TemplateItem extends React.Component {

    deleteTemplate = async id => {
        const ref = firestore.doc(`/workoutTemplates/${id}`);
        await ref.delete();
        this.props.handleTemplateDelete(id);
    }

    render() {
        const {id, workoutName, exercises, history } = this.props;
        return (
            <div className='template-item'>
                <h1>{workoutName ? workoutName : '...'}</h1>
                <div className='buttons'>
                    <CustomButton onClick={() => history.push(`/templates/${workoutName}`)}>EDIT</CustomButton>
                    <CustomButton onClick={() => this.deleteTemplate(id)}>DELETE</CustomButton>
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

export default withRouter(TemplateItem);