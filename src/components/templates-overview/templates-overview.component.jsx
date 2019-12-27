import React from 'react';
import { connect } from 'react-redux';

import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';
import { selectWorkoutTemplatesMap } from '../../redux/workout-templates/workout-templates-selectors';

import TemplateItem from '../template-item/template-item.component';

import './templates-overview.styles.scss';

class TemplatesOverview extends React.Component {

    deleteTemplate = id => {
        this.props.updateTemplates(this.props.workoutTemplates.filter(template => template.id !== id));
    }

    render() {
        const { workoutTemplates } = this.props;
        return (
            <div className='templates-overview'>
                <h1>Manage your workout templates</h1>
                <h4>Here you can adjust or delete your workout templates</h4>
                {
                    workoutTemplates ? workoutTemplates.map(({ id, ...otherProps }) => <TemplateItem key={id} id={id} {...otherProps} handleTemplateDelete={this.deleteTemplate} />) : '...'
                }
            </div>
        )
    }
}


const mapStateToProps = state => ({
    workoutTemplates: selectWorkoutTemplatesMap(state)
})

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesOverview);
