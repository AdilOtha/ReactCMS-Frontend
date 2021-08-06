import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  Redirect,
  useLocation
} from "react-router-dom";

import Menus from './Menus';
import MenusAddEdit from './MenusAddEdit';
import MenuItems from './MenuItems';
import MenuItemsAddEdit from './MenuItemsAddEdit';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function CenteredTabs() {
  // The `path` lets us build <Route> paths that are
  // relative to the parent route, while the `url` lets
  // us build relative links.
  let { path } = useRouteMatch();
  let location = useLocation();
  const classes = useStyles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    // console.log(location);
    if (location.pathname.includes("/menu-master/menus")) {
      setValue(0);
    } else {
      setValue(1);
    }
  }, [location.pathname])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={classes.appBarSpacer} />
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Menus" component={Link} to={`${path}/menus`} />
          <Tab label="Menu Items" component={Link} to={`${path}/menu-items`} />
        </Tabs>
      </Paper>
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${path}/menus`} />
        </Route>
        <Route exact path={`${path}/menus`}>
          <Menus />
        </Route>
        <Route exact path={`${path}/menus/create`}>
          <MenusAddEdit />
        </Route>
        <Route exact path={`${path}/menus/create/:menuId`}>
          <MenusAddEdit />
        </Route>
        <Route exact path={`${path}/menu-items`}>
          <MenuItems />
        </Route>
        <Route exact path={`${path}/menu-items/create`}>
          <MenuItemsAddEdit />
        </Route>
        <Route exact path={`${path}/menu-items/create/:menuItemId`}>
          <MenuItemsAddEdit />
        </Route>
      </Switch>
    </>
  );
}