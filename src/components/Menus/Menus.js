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
import EnhancedTableHead from '../../models/EnhancedTableHead';
import EnhancedTableToolbar from '../../models/EnhancedTableToolbar';
import { getComparator, stableSort } from '../../helpers/tableOperations';
import { Link, useRouteMatch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import axios from '../../interceptors/auth.interceptor';;
require('dotenv').config();

const useStyles = makeStyles((theme) => ({
    root: {
    },
    paper: {
        margin: 'auto',
        marginTop: '0.5rem',
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    dialogActions: {
        justifyContent: 'space-around',
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
}));

export default function Menus() {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { url } = useRouteMatch();
    const classes = useStyles();
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        axios.get(apiUrl + "/api/menus")
            .then(res => {
                console.log(res);
                setMenus(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [apiUrl]);

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'datePosted', numeric: true, disablePadding: false, label: 'Date Posted' },
        { id: 'editBtn', numeric: false, disablePadding: false, label: 'Edit' },
    ];

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = menus.map((n) => n._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const onDeleteSelected = async () => {
        try {
            await axios.post(apiUrl + "/api/menus/delete", {
                menuIds: selected
            });
            if (selected.length >= (menus.length - page * rowsPerPage)) {
                setPage((prevVal) => {
                    console.log(prevVal);
                    let newVal = prevVal - Math.ceil(selected.length / rowsPerPage);
                    if (newVal >= 0) {
                        return newVal;
                    } else {
                        return 0;
                    }
                });
            }
            setSelected([]);
            const result2 = await axios.get(apiUrl + "/api/menus")
            setMenus(result2.data);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, menus.length - page * rowsPerPage);

    return (
        <>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <div className={classes.root}>
                        <Paper className={classes.paper}>
                            <EnhancedTableToolbar
                                numSelected={selected.length}
                                onDeleteSelected={onDeleteSelected}
                                title="Your Menus"
                                isMenuPage={true}
                                addButtonRoute={`${url}/create`}
                            />
                            <TableContainer>
                                <Table
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
                                        rowCount={menus.length}
                                        headCells={headCells}
                                    />
                                    <TableBody>
                                        {stableSort(menus, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row._id);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row._id}
                                                        selected={isItemSelected}
                                                        className={classes.tableRow}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                onClick={(event) => handleClick(event, row._id)}
                                                                checked={isItemSelected}
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </TableCell>
                                                        <TableCell component="th" id={labelId} scope="row" padding="none">
                                                            <Link to={`menu-items?menuId=${row._id}`}>
                                                                {row.name}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell align="right">{row.datePosted && new Date(row.datePosted).toLocaleDateString("en-IN")}</TableCell>
                                                        <TableCell align="left">
                                                            <Link to={`${url}/create/${row._id}`}>
                                                                <Button variant="outlined">
                                                                    <EditIcon fontSize="small" />
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
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
                                count={menus.length}
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
