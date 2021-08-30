import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, useParams, useHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';

import axios from '../../interceptors/auth.interceptor';
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
            marginBottom: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
    }
));

export default function MenuItemsAddEdit() {
    const classes = useStyles();
    let { menuItemId } = useParams();
    const history = useHistory();

    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');

    const [menus, setMenus] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [selectedMenuItems, setSelectedMenuItems] = useState([]);
    const [selectedMenuItemType, setSelectedMenuItemType] = useState(0);
    const [articles, setArticles] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState('');
    const [categories, setCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [dynamicOptions, setDynamicOptions] = useState(null);

    useEffect(() => {
        axios.get(apiUrl + "/api/menus/")
            .then(res => {
                console.log(res);
                setMenus(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(apiUrl + "/api/menu-items/")
            .then(res => {
                console.log(res);
                setMenuItems(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(apiUrl + `/api/articles`)
            .then(res => {
                console.log(res);
                setArticles(res.data.articles);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(apiUrl + `/api/categories`)
            .then(res => {
                console.log(res);
                setCategories(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        if (menuItemId) {
            axios.get(apiUrl + "/api/menu-items/" + menuItemId)
                .then(res => {
                    console.log(res);
                    setName(res.data.name);
                    setSelectedMenu(res.data.menuIds[0]._id);
                    if (res.data.typeArticle) {
                        setSelectedArticle(res.data.typeArticle._id);
                        setSelectedMenuItemType(1);
                    }
                    if (res.data.typeCategory) {
                        setSelectedCategory(res.data.typeCategory._id);
                        setSelectedMenuItemType(2);
                    }
                    if (res.data.typeDropDown.length > 0) {
                        console.log({ dropDown: res.data.typeDropDown })
                        setMenuItems((prevVal) => {
                            let newVal = prevVal.filter((value) => {
                                return value._id !== menuItemId;
                            });
                            console.log({ newVal });
                            return newVal;
                        });
                        setSelectedMenuItemType(3);
                        setSelectedMenuItems(res.data.typeDropDown);
                    }
                })
                .catch(err => {
                    if (err.response)
                        console.log(err.response.data.error);
                });
        }
    }, [menuItemId, apiUrl]);


    // SET DYNAMIC OPTIONS
    useEffect(() => {
        if (selectedMenuItemType === 1) {
            setDynamicOptions((
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Articles</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        fullWidth
                        value={selectedArticle}
                        onChange={(event) => setSelectedArticle(event.target.value)}
                    >
                        {articles && articles.map((item, index) => {
                            return <MenuItem key={index} value={item._id}>{item.title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            ));
        } else if (selectedMenuItemType === 2) {
            setDynamicOptions((
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Categories</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        fullWidth
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                        {categories && categories.map((item, index) => {
                            return <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            ));
        } else if (selectedMenuItemType === 3) {
            setDynamicOptions((<FormControl className={classes.formControl} fullWidth>
                <InputLabel id="demo-mutiple-chip-label">Select Items for Dropdown</InputLabel>
                <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={selectedMenuItems}
                    onChange={handleSelectedMenuItemChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                        <div className={classes.chips}>
                            {selected.map((value) => (
                                <Chip key={value._id} label={value.name} className={classes.chip} />
                            ))}
                        </div>
                    )}
                >
                    {menuItems && menuItems.map((value, index) => (
                        <MenuItem key={index} value={value}>
                            {value.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>));
        }
    }, [articles, selectedArticle, categories, selectedCategory, selectedMenuItemType, selectedMenuItems]);

    const handleSelectedMenuItemChange = (event) => {
        let flag = true;
        let newArray = event.target.value;
        if (newArray.length > 0) {
            let latestVal = newArray[newArray.length - 1];
            console.log({ latestVal });
            let matchedIndex = null;
            selectedMenuItems.forEach((value, index) => {
                if (value._id === latestVal._id) {
                    matchedIndex = index;
                    flag = false;
                }
            });
            if (matchedIndex !== null) {
                newArray = newArray.filter((value) => {
                    return value._id !== newArray[matchedIndex]._id;
                });
                console.log(newArray);
                setSelectedMenuItems(newArray);
            }
            if (flag) {
                setSelectedMenuItems(newArray);
            }
        } else {
            setSelectedMenuItems([]);
        }
    }

    const saveMenuItem = async (event) => {
        event.preventDefault();
        setSaving(true);
        let apiPath = '';
        let body = {
            name: name,
            menuIds: selectedMenu,
        }

        if (selectedMenuItemType === 1) {
            body.typeArticle = selectedArticle;
        } else if (selectedMenuItemType === 2) {
            body.typeCategory = selectedCategory;
        } else if (selectedMenuItemType === 3) {
            body.typeDropDown = selectedMenuItems;
        }

        if (menuItemId) {
            apiPath = '/api/menu-items/update/' + menuItemId;
        } else {
            apiPath = '/api/menu-items/insert';
        }

        try {
            const result = await axios.post(apiUrl + apiPath, body);
            console.log(result);
            setSaving(false);
            history.push('/dashboard/menu-master/menu-items');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Container maxWidth="md">
                <form noValidate autoComplete="off" onSubmit={(event) => { saveMenuItem(event) }}>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={8} md={6}>
                            <Paper className={classes.paper} elevation={3} >
                                <Grid container justify="center" spacing={3}>
                                    <Grid item xs={12}>
                                        {menuItemId ? (<TextField fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => setName(event.target.value)}
                                            value={name || ''} />)
                                            : (<TextField fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => setName(event.target.value)} />)}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Menu</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                fullWidth
                                                value={selectedMenu}
                                                onChange={(event) => setSelectedMenu(event.target.value)}
                                            >
                                                <MenuItem value={''}>-- Select an Option --</MenuItem>
                                                {menus.map((item, index) => {
                                                    return (
                                                        <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Menu Item Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                fullWidth
                                                value={selectedMenuItemType}
                                                onChange={(event) => setSelectedMenuItemType(event.target.value)}
                                            >
                                                <MenuItem value={0}>-- Select an Option --</MenuItem>
                                                <MenuItem value={1}>Single Article</MenuItem>
                                                <MenuItem value={2}>Category</MenuItem>
                                                <MenuItem value={3}>Dropdown</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {dynamicOptions}
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container justify="space-evenly">
                                    <Grid item>
                                        <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link to="/dashboard/menu-master/menu-items" style={{ textDecoration: 'none' }}>
                                            <Button variant="contained">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    )
}