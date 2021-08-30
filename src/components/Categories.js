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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from '../interceptors/auth.interceptor';
import EnhancedTableHead from '../models/EnhancedTableHead';
import EnhancedTableToolbar from '../models/EnhancedTableToolbar';
import { getComparator, stableSort } from '../helpers/tableOperations';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';

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
    dialogActions: {
        justifyContent: 'space-around',
    }
}));

export default function Categories() {
    const classes = useStyles();
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('title');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [category, setCategory] = useState({ name: '', _id: null, datePosted: null });
    const [categories, setCategories] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const loadCategories = () => {
        axios.get(apiUrl + "/api/categories")
            .then(res => {
                console.log(res);
                setCategories(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        axios.get(apiUrl + "/api/categories")
            .then(res => {
                console.log(res);
                setCategories(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [apiUrl]);

    const saveCategory = async (event) => {
        event.preventDefault();
        console.log(category);
        if (!category.name) {
            return;
        }
        let apiPath = '';
        if (isEdit) {
            apiPath = '/api/categories/update/' + category._id;
        } else {
            apiPath = '/api/categories/insert';
        }
        try {
            const body = {
                name: category.name
            }
            const result = await axios.post(apiUrl + apiPath, body);
            console.log(result);
        } catch (err) {
            console.log(err);
        } finally {
            setCategory({ name: '', _id: null, datePosted: null });
            handleDialogCallback(false);
            setIsEdit(false);
            loadCategories();
        }
    }

    const editCategory = (category) => {
        setCategory(category);
        setIsEdit(true);
        handleDialogCallback(true);
    }

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'datePosted', numeric: true, disablePadding: false, label: 'Date Posted' },
        { id: 'editBtn', numeric: false, disablePadding: false, label: 'Edit' },
    ];

    const handleCategoryNameChange = (event) => {
        setCategory({ ...category, name: event.target.value });
    }

    const handleDialogCallback = (value) => {
        setDialogOpen(value);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories.map((n) => n._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const onDeleteSelected = async () => {
        try {
            await axios.post(apiUrl + "/api/categories/delete", {
                categoryIds: selected
            });
            if (selected.length >= (categories.length - page * rowsPerPage)) {
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
            const result2 = await axios.get(apiUrl + "/api/categories")
            setCategories(result2.data);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, categories.length - page * rowsPerPage);

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
                                title="Your Categories"
                                dialogCallback={handleDialogCallback}
                                isCategoryPage={true}
                            />
                            <Dialog open={dialogOpen} onClose={() => { handleDialogCallback(false) }} aria-labelledby="form-dialog-title">
                                <form onSubmit={saveCategory}>
                                    <DialogTitle id="form-dialog-title">Add New Category</DialogTitle>
                                    <DialogContent>
                                        {isEdit ? (<TextField
                                            autoFocus
                                            id="categoryName"
                                            label="Name"
                                            type="text"
                                            fullWidth
                                            onChange={handleCategoryNameChange}
                                            value={category.name || ''}
                                        />) : (<TextField
                                            autoFocus
                                            id="categoryName"
                                            label="Name"
                                            type="text"
                                            fullWidth
                                            onChange={handleCategoryNameChange}
                                            value={category.name}
                                        />)}
                                    </DialogContent>
                                    <DialogActions className={classes.dialogActions}>
                                        <Button onClick={() => { handleDialogCallback(false); setIsEdit(false); }} color="secondary">
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary">
                                            Save
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
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
                                        rowCount={categories.length}
                                        headCells={headCells}
                                    />
                                    <TableBody>
                                        {stableSort(categories, getComparator(order, orderBy))
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
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="right">{row.datePosted && new Date(row.datePosted).toLocaleDateString("en-IN")}</TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="outlined" onClick={() => editCategory(row)}>
                                                                <EditIcon fontSize="small" />
                                                            </Button>
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
                                count={categories.length}
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
