import React from 'react';
import { connect } from 'react-redux';

import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';

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
                {
                    workoutTemplates ? workoutTemplates.map(({ id, ...otherProps }) => <TemplateItem key={id} id={id} {...otherProps} handleTemplateDelete={this.deleteTemplate} />) : '...'
                }
            </div>
        )
    }
}


const mapStateToProps = ({ workoutTemplates: { workoutTemplates } }) => ({
    workoutTemplates: Object.keys(workoutTemplates).map(key => workoutTemplates[key])
})

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesOverview);
