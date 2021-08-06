import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EnhancedTableHead from '../../models/EnhancedTableHead';
import EnhancedTableToolbar from '../../models/EnhancedTableToolbar';
import Grid from '@material-ui/core/Grid';
import { getComparator, stableSort } from '../../helpers/tableOperations';

require('dotenv').config();

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    marginTop: '1rem',
  },
  paper: {
    margin: 'auto',
    marginTop: '0.5rem',
    width: '95%',
    marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  tableRow: {
    cursor: 'pointer',
  }
}));

export default function Articles() {
  const classes = useStyles();
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(apiUrl + "/api/articles")
      .then(res => {
        console.log(res);
        setArticles(res.data.articles);
      })
      .catch(err => {
        console.log(err);
      });
  }, [apiUrl]);

  const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
    { id: 'datePosted', numeric: true, disablePadding: false, label: 'Date Posted' },
    { id: 'published', numeric: false, disablePadding: false, label: 'Published' },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = articles.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onDeleteSelected = async () => {
    try {
      const result = await axios.post(apiUrl + "/api/articles/delete", {
        articleIds: selected
      });
      if (selected.length >= (articles.length - page * rowsPerPage)) {
        setPage((prevVal) => {
          let newVal = prevVal - Math.ceil(selected.length / rowsPerPage);
          if (newVal >= 0) {
            return newVal;
          } else {
            return 0;
          }
        });
      }
      setSelected([]);
      console.log(result);
      const result2 = await axios.get(apiUrl + "/api/articles")
      setArticles(result2.data.articles);
    } catch (err) {
      console.log(err);
    }
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, articles.length - page * rowsPerPage);

  return (
    <>
      <div className={classes.appBarSpacer} />
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item xs={12} md={6}>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                onDeleteSelected={onDeleteSelected}
                title="Your Articles"
                addButtonRoute="/articles/create"
                isArticlePage={true} />
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={'medium'}
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={articles.length}
                    headCells={headCells}
                  />
                  <TableBody>
                    {stableSort(articles, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row._id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row._id}
                            selected={isItemSelected}
                            className={classes.tableRow}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                              <Link to={"/articles/" + row._id}>{row.title}</Link>
                            </TableCell>
                            <TableCell align="right">{new Date(row.datePosted).toLocaleDateString("en-IN")}</TableCell>
                            <TableCell align="left">{row.published ? 'Yes' : 'No'}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={articles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
