import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { firestore, convertTemplatesSnapshotToMap } from '../../firebase/firebase.utils';
import { updateTemplates } from '../../redux/workout-templates/workout-templates-actions';

import TemplatesOverview from '../../components/templates-overview/templates-overview.component';
import WithLoading from '../../components/with-loading/with-loading.component';
import ReviewTemplate from '../../components/review-template/review-template.component';
import TemplateGoals from '../../components/template-goals/template-goals.component';

import './templates.styles.scss';

const TemplatesOverviewWithLoading = WithLoading(TemplatesOverview);
const ReviewTemplateWithLoading = WithLoading(ReviewTemplate);
const TemplateGoalsWithLoading = WithLoading(TemplateGoals);

class TemplatesPage extends React.Component {
    state = {
        loading: true
    }

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
            if(this.state.loading){
                this.setState({
                    loading: false
                })
            }
        });
    }

    render() {
        const { match } = this.props;
        const { loading } = this.state;
        return (
            <div className='templates'>
                <Route exact path={`${match.path}`} render={props => <TemplatesOverviewWithLoading isLoading={loading} {...props} /> } />
                <Route exact path={`${match.path}/:templateName`} render={props => <ReviewTemplateWithLoading isLoading={loading} {...props} /> } />
                <Route exact path={`${match.path}/:templateName/goals`} render={props => <TemplateGoalsWithLoading isLoading={loading} {...props} />} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateTemplates: templates => dispatch(updateTemplates(templates))
})

export default withRouter(connect(null, mapDispatchToProps)(TemplatesPage));