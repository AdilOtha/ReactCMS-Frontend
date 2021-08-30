import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../models/Auth";

export const NonProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!auth.isAuthenticated()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/dashboard",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};