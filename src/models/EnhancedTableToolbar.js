import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


const useToolbarStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  }));
  
export default function EnhancedTableToolbar(props) {
    const classes = useToolbarStyles();
    const { numSelected, onDeleteSelected, title, addButtonRoute, dialogCallback } = props;
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <>
            <div>
              <Typography variant="h6" id="tableTitle" component="div">
                {title}
              </Typography>
            </div>
            <div>
              {addButtonRoute ?
              (<Link to={addButtonRoute} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Add New
                </Button>
              </Link>) : (
                <Button variant="contained" color="primary" onClick={()=>{dialogCallback(true)}}>
                  Add New
                </Button>
              )}
            </div>
          </>
        )}
  
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={onDeleteSelected}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };
  
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };