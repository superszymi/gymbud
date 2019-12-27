import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { firestore, convertTemplatesSnapshotToMap } from '../../firebase/firebase.utils';
import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';

import TemplatesOverview from '../../components/templates-overview/templates-overview.component';
import TemplateEdit from '../../components/template-edit/template-edit.component';

import './templates.styles.scss';

class TemplatesPage extends React.Component {

    unsubscribeFromSnapshot = null;

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        if(!this.props.currentUser || !this.props.updateTemplates) return null;

        const { updateTemplates, currentUser } = this.props;
        const templatesRef = firestore.collection('workoutTemplates').where('user', '==', firestore.doc(`/users/${currentUser.id}`));
        this.unsubscribeFromSnapshot = templatesRef.get().then(snapshot => {
            const templatesMap = convertTemplatesSnapshotToMap(snapshot);
            updateTemplates(templatesMap);
        });
    }

    render() {
        const { match } = this.props;
        return (
            <div className='templates'>
                <Route exact path={`${match.path}`} component={TemplatesOverview} />
                <Route exact path={`${match.path}/:templateName`} component={TemplateEdit} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

const mapStateToProps = state => ({
    currentUser: selectCurrentUser(state)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TemplatesPage));