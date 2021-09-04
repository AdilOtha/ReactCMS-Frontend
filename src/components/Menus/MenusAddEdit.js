import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link, useParams, useHistory } from 'react-router-dom';

import axios from '../../interceptors/auth.interceptor';;
require('dotenv').config();

const useStyles = makeStyles((theme) => (
    {
        root: {
            width: '100%',
        },
        paper: {
            padding: '1rem',
            margin: 'auto',
            marginTop: '0.5rem',
            width: '95%',
            marginBottom: theme.spacing(2),
        },
    }
));

export default function MenusAddEdit() {
    const classes = useStyles();
    let { menuId } = useParams();
    const history = useHistory();

    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [selectedMenuType, setSelectedMenuType] = useState(0);
    const [selectedModuleType, setSelectedModuleType] = useState(0);
    const [isMainMenu, setIsMainMenu] = useState(false);
    const [dynamicMenuOptions, setDynamicMenuOptions] = useState(null);
    const [dynamicModuleOptions, setDynamicModuleOptions] = useState(null);

    useEffect(() => {
        if (menuId) {
            axios.get(apiUrl + "/api/menus/" + menuId)
                .then(res => {
                    console.log(res);
                    setName(res.data.name);
                    axios.get(apiUrl + "/api/main-menu")
                        .then((res) => {
                            console.log(res)
                            if (res.data.menuId === menuId) {
                                setIsMainMenu(true);
                            } else {
                                setIsMainMenu(false);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [menuId, apiUrl]);

    // SET DYNAMIC OPTIONS
    useEffect(() => {
        if (selectedMenuType === 3) {
            setDynamicMenuOptions((<FormControl fullWidth>
                <InputLabel id="module-type">Select Module Type</InputLabel>
                <Select
                    labelId="module-type"
                    id="module-type-label"
                    fullWidth
                    value={selectedModuleType}
                    onChange={(event) => setSelectedModuleType(event.target.value)}
                >
                    <MenuItem value={0}>-- Select an Option --</MenuItem>
                    <MenuItem value={1}>Custom Selection</MenuItem>
                    <MenuItem value={2}>Custom Article Filter</MenuItem>
                </Select>
            </FormControl>));
        } else {
            setDynamicMenuOptions(null);
        }
    }, [selectedMenuType]);

    useEffect(()=>{
        if(selectedModuleType == 1) {
            setDynamicModuleOptions("Custom Selection");
        } else if(selectedModuleType == 2){
            setDynamicModuleOptions("Custom Article Filter");
        } else {
            setDynamicModuleOptions(null);
        }
    },[selectedModuleType]);

    const saveMenu = async (event) => {
        event.preventDefault();
        setSaving(true);
        let apiPath = '';
        const body = {
            name
        }
        apiPath = menuId ? ('/api/menus/update/' + menuId) : ('/api/menus/insert');
        try {
            const result = await axios.post(apiUrl + apiPath, body);
            console.log(result);
            if (isMainMenu) {
                let body2 = menuId ? { menuId } : { menuId: result._id };
                const result2 = await axios.post(apiUrl + '/api/main-menu', body2);
                console.log(result2);
            }
            setSaving(false);
            history.push('/dashboard/menu-master/menus');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Container maxWidth="md">
                <form noValidate autoComplete="off" onSubmit={(event) => { saveMenu(event) }}>
                    <Paper className={classes.paper} elevation={3} >
                        <Grid container justify="center">
                            <Grid item sm={6}>
                                {menuId ? (<TextField margin="dense" fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => setName(event.target.value)}
                                    value={name || ''} />)
                                    : (<TextField margin="dense" fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => setName(event.target.value)} />)}
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Menu Item Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        value={selectedMenuType}
                                        onChange={(event) => setSelectedMenuType(event.target.value)}
                                    >
                                        <MenuItem value={0}>-- Select an Option --</MenuItem>
                                        <MenuItem value={1}>Main Menu</MenuItem>
                                        <MenuItem value={2}>Side Menu</MenuItem>
                                        <MenuItem value={3}>Module</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {dynamicMenuOptions && <Grid item xs={12}>
                                {dynamicMenuOptions}
                            </Grid>}
                            {dynamicModuleOptions && <Grid item xs={12}>
                                {dynamicModuleOptions}
                            </Grid>}
                            {/* {isMainMenu ? (<Typography variant={"h6"}>
                                Currently set as Main Menu
                            </Typography>) : (<FormControlLabel
                                control={
                                    <Switch
                                        checked={isMainMenu}
                                        onChange={(event) => {
                                            setIsMainMenu((prevVal) => {
                                                return !prevVal;
                                            });
                                        }}
                                        name="isMainMenu"
                                        color="primary"
                                    />
                                }
                                label="Set as Main Menu"
                            />)} */}
                        </Grid>
                        <br />
                        <Grid container justify="space-evenly">
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                    Save
                                </Button>
                            </Grid>
                            <Grid item>
                                <Link to="/dashboard/menu-master/menus" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained">
                                        Cancel
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </Container>
        </>
    )
}