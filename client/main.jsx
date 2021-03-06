import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import '/client/assets/css/material-dashboard-react.css'; // todo check if it works
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import SignInPage from './views/auth/signInPage';
import SignUpPage from './views/auth/signUpPage';
import SignUpConfirmationNotePage from './views/auth/signUpConfirmationNotePage';
import EmailVerificationPage from './views/auth/emailVerificationPage';
import SetInitialPasswordPage from './views/auth/setInitialPasswordPage';
import { routes } from './routes';
import MainLayoutRoute from './layouts/mainLayoutRoute';
import LoginLayoutRoute from './layouts/loginLayoutRoute';
import reducers from './services/reducers';
import { rootSaga } from './services/actions';
import SnackbarProvider from './components/snackbar/snackbarProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import Promise from 'bluebird';
import '../model/roles';
import './subscriptions';

export const history = createBrowserHistory();

Meteor.callAsync = Promise.promisify(Meteor.call);

Meteor.startup(() => {
  const loggerMiddleware = createLogger();

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    applyMiddleware(loggerMiddleware, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  const mainLayoutRoutes = routes.map((prop, key) => (
    <MainLayoutRoute
      path={prop.path}
      component={prop.component}
      key={key}
    />
  ));

  ReactDOM.render(
    <CssBaseline>
      <Provider store={store}>
        <SnackbarProvider SnackbarProps={{ autoHideDuration: 3500 }}>
          <Router history={history}>
            <Switch>
              <Route exact path="/">
                <Redirect from="/" to="/dashboard" />
              </Route>

              <LoginLayoutRoute path="/login" component={SignInPage} />
              <LoginLayoutRoute path="/signup" component={SignUpPage} />

              <LoginLayoutRoute
                path="/signup-confirmation-note"
                component={SignUpConfirmationNotePage}
              />

              <LoginLayoutRoute path="/verify-email" component={EmailVerificationPage} />
              <LoginLayoutRoute path="/set-initial-password" component={SetInitialPasswordPage} />

              {mainLayoutRoutes}
            </Switch>
          </Router>
        </SnackbarProvider>
      </Provider>
    </CssBaseline>,

    document.getElementById('root'),
  );
});
