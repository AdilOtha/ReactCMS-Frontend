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

import axios from 'axios';
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
    const [selectedMenu, setSelectedMenu] = useState('');
    const [selectedMenuItemType, setSelectedMenuItemType] = useState(0);
    const [articles, setArticles] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState('');
    const [categories, setCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [dynamicOptions, setDynamicOptions] = useState(null);

    useEffect(() => {
        if (menuItemId) {
            axios.get(apiUrl + "/api/menu-items/" + menuItemId)
                .then(res => {
                    console.log(res);
                    setName(res.data.name);
                    setSelectedMenu(res.data.menuIds[0]._id);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [menuItemId, apiUrl]);

    useEffect(() => {
        axios.get(apiUrl + "/api/menus/")
            .then(res => {
                console.log(res);
                setMenus(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [apiUrl]);

    useEffect(() => {
        let apiPath = null;
        if (selectedMenuItemType !== 0) {
            console.log("run");
            if (selectedMenuItemType === 1) {
                apiPath = "articles";
            } else if (selectedMenuItemType === 2) {
                apiPath = "categories";
            }
            axios.get(apiUrl + `/api/${apiPath}`)
                .then(res => {
                    console.log(res);
                    if (selectedMenuItemType === 1) {
                        setArticles(res.data.articles);
                    } else if (selectedMenuItemType === 2) {
                        setCategories(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [apiUrl, selectedMenuItemType]);

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
                        onChange={handleArticleChange}
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
                        onChange={handleCategoryChange}
                    >
                        {categories && categories.map((item, index) => {
                            return <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            ));
        }
    }, [articles, selectedArticle, categories, selectedCategory, selectedMenuItemType]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleMenuChange = (event) => {
        setSelectedMenu(event.target.value);
    }

    const handleMenuItemTypeChange = (event) => {
        console.log(event.target.value);
        setSelectedMenuItemType(event.target.value);
    }

    const handleArticleChange = (event) => {
        setSelectedArticle(event.target.value);
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    }

    const saveMenuItem = async (event) => {
        event.preventDefault();
        setSaving(true);
        let apiPath = '';
        let body = {
            name: name,
            menuIds: [],
        }
        body.menuIds.push(selectedMenu);
        if (selectedMenuItemType === 1) {
            body.typeArticle = selectedArticle;
        } else if (selectedMenuItemType === 2) {
            body.typeCategory = selectedCategory;
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
            history.push('/menu-master/menu-items');
        } catch (err) {
            console.log(err);
        }
    }

    // let dynamicOptions = null;

    // if (selectedMenuItemType === 1) {
    //     dynamicOptions = (
    //         <FormControl fullWidth>
    //             <InputLabel id="demo-simple-select-label">Menu Item Type</InputLabel>
    //             <Select
    //                 labelId="demo-simple-select-label"
    //                 id="demo-simple-select"
    //                 fullWidth
    //                 value={selectedArticle}
    //                 onChange={handleArticleChange}
    //             >
    //                 {articles.map((item, index) => {
    //                     return <MenuItem key={index} value={item._id}>{item.title}</MenuItem>
    //                 })}
    //             </Select>
    //         </FormControl>
    //     );
    // } else if (selectedMenuItemType === 2) {
    //     dynamicOptions = (
    //         <FormControl fullWidth>
    //             <InputLabel id="demo-simple-select-label">Menu Item Type</InputLabel>
    //             <Select
    //                 labelId="demo-simple-select-label"
    //                 id="demo-simple-select"
    //                 fullWidth
    //                 value={selectedCategory}
    //                 onChange={handleCategoryChange}
    //             >
    //                 {categories.map((item, index) => {
    //                     return <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
    //                 })}
    //             </Select>
    //         </FormControl>
    //     );
    // }



    return (
        <>
            <Container maxWidth="md">
                <form noValidate autoComplete="off" onSubmit={(event) => { saveMenuItem(event) }}>
                    <Grid container justify="center">
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.paper} elevation={3} >
                                <Grid container justify="center" spacing={3}>
                                    <Grid item xs={12}>
                                        {menuItemId ? (<TextField fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => handleNameChange(event)}
                                            value={name || ''} />)
                                            : (<TextField fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event) => handleNameChange(event)} />)}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Menu</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                fullWidth
                                                value={selectedMenu}
                                                onChange={handleMenuChange}
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
                                                onChange={handleMenuItemTypeChange}
                                            >
                                                <MenuItem value={0}>-- Select an Option --</MenuItem>
                                                <MenuItem value={1}>Single Article</MenuItem>
                                                <MenuItem value={2}>Category</MenuItem>
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
                                        <Link to="/menu-master/menu-items" style={{ textDecoration: 'none' }}>
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