import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));

const ProcessDashboard = lazy(() => import('./process/ProcessDashboard'));
const ProcessList = lazy(() => import('./process/ProcessList'));
const ProcessDetail = lazy(() => import('./process/ProcessDetail'));
const ProcessGoalManter = lazy(() => import('./process-goal/ProcessGoalManter'));
const ActivityGoalList = lazy(() => import('./activity-goal/ActivityGoalList'));
const AgentList = lazy(() => import('./agent/AgentList'));
const AgentDetail = lazy(() => import('./agent/AgentDetail'));
const AgentTypeList = lazy(() => import('./agent-type/AgentTypeList'));
const AgentSpecialtyList = lazy(() => import('./agent-specialty/AgentSpecialtyList'));
const DesireList  = lazy(() => import('./desire/DesireList'));
const CriteriaList = lazy(() => import('./assessment/criteria/CriteriaList'));
const QuizList = lazy(() => import('./assessment/quiz/QuizList'));
const SocializationList = lazy(() => import('./socialization/SocializationList'));
const SocializationDetail = lazy(() => import('./socialization/SocializationDetail'));

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>

          
          <Route exact path="/dashboard" component={ Dashboard } />

          <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
          <Route path="/basic-ui/typography" component={ Typography } />

          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />

          <Route path="/icons/mdi" component={ Mdi } />

          <Route path="/charts/chart-js" component={ ChartJs } />


          <Route path="/user-pages/login-1" component={ Login } />
          <Route path="/user-pages/register-1" component={ Register1 } />

          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />
          
          <Route path="/basic-records/activity-goal" component={ ActivityGoalList } />
          <Route path="/basic-records/agent-type" component={ AgentTypeList } />
          <Route path="/basic-records/agent-specialty" component={ AgentSpecialtyList } />
          <Route path="/basic-records/process-goal" component={ ProcessGoalManter } />
          <Route path="/basic-records/desire" component={ DesireList } />
          <Route path="/agents/:id" component={ AgentDetail } />
          <Route path="/agents" component={ AgentList } />
          <Route path="/process/:id" component={ ProcessDetail } />
          <Route path="/process" component={ ProcessList } />
          <Route path="/assessment/criteria" component={ CriteriaList } />
          <Route path="/assessment/quiz" component={ QuizList } />
          <Route path="/socialization/:id" component={ SocializationDetail } />>
          <Route path="/socialization" component={ SocializationList } />>

          <Route path="/motiro" component={ ProcessDashboard } />
          
          <Redirect to="/motiro" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;