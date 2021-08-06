import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CategoryIcon from '@material-ui/icons/Category';
import BookIcon from '@material-ui/icons/Book';
import AppsIcon from '@material-ui/icons/Apps';
import { Link } from 'react-router-dom';

export const MainListItems = (props) => {
  const { handleClick } = props;
  return (
    <>
      <div>
        <Link to="/articles" style={{ textDecoration: 'none' }} onClick={handleClick}>
          <ListItem button>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Articles" />
          </ListItem>
        </Link>
        <Link to="/categories" style={{ textDecoration: 'none' }} onClick={handleClick}>
          <ListItem button>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem></Link>
        <Link to="/menu-master" style={{ textDecoration: 'none' }} onClick={handleClick}>
          <ListItem button>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Menus" />
          </ListItem>
        </Link>
      </div>
    </>
  );
}

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
