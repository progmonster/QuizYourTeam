import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from './mainLayout';

const MainLayoutRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={matchProps => (
      <MainLayout>
        <Component {...matchProps} />
      </MainLayout>
    )}
  />
);

export default MainLayoutRoute;
