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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import EnhancedTableHead from '../models/EnhancedTableHead';
import EnhancedTableToolbar from '../models/EnhancedTableToolbar';
import { descendingComparator, getComparator, stableSort } from '../helpers/tableOperations';

require('dotenv').config();

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        margin: 'auto',
        marginTop: '0.5rem',
        width: '95%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
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

export default function Categories() {
    const classes = useStyles();
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('title');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [categories, setCategories] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        axios.get(apiUrl + "/api/categories")
            .then(res => {
                console.log(res);
                setCategories(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Title' },
    ];

    const handleDialogCallback = (value) =>{
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
            const result = await axios.post(apiUrl + "/api/categories/delete", {
                articleIds: selected
            });
            setSelected([]);
            console.log(result);
            const result2 = await axios.get(apiUrl + "/api/categories")
            setCategories(result2.data.categories);
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
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        onDeleteSelected={onDeleteSelected}
                        title="Your Categories"
                        dialogCallback={handleDialogCallback}
                    />
                    <Dialog open={dialogOpen} onClose={()=>{setDialogOpen(false)}} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We will send updates
                                occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>{setDialogOpen(false)}} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={()=>{setDialogOpen(false)}} color="primary">
                                Subscribe
                            </Button>
                        </DialogActions>
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
                                                    <Link to={"/categories/" + row._id}>{row.title}</Link>
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
                        count={categories.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </>
    );
}
