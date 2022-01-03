import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
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
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
    }
));

function getStyles(value, array, theme) {
    let index = array.findIndex((element) => {
        return element._id === value._id
    });
    return {
        fontWeight:
            index === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MenusAddEdit() {
    const classes = useStyles();
    const theme = useTheme();
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
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dataType, setDataType] = useState('None');
    const [fieldType, setFieldType] = useState('None');
    const [sortType, setSortType] = useState('None');

    const handleSelectedArticles = (event) => {
        let newValue = event.target.value;
        let flag = false;
        articles.forEach((article) => {
            newValue.forEach((value) => {
                if (article._id === value._id) {
                    flag = true;
                }
            });            
        });
        if(!flag){
            setSelectedArticles(newValue);
        }
    }

    useEffect(() => {
        if (menuId) {
            axios.get(apiUrl + "/api/menus/" + menuId)
                .then(res => {
                    let isMainMenu = false, isSideMenu = false;
                    console.log(res);
                    if (res.data) {
                        setName(res.data.name);
                        axios.get(apiUrl + "/api/main-menu")
                            .then((res) => {
                                console.log(res);
                                if (res.data?.menuId) {
                                    if (res.data.menuId === menuId) {
                                        setSelectedMenuType(1);
                                        isMainMenu = true;
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        if (!isMainMenu) {
                            axios.get(apiUrl + "/api/side-menu")
                                .then((res) => {
                                    console.log(res);
                                    if (res.data?.menuId) {
                                        if (res.data.menuId === menuId) {
                                            setSelectedMenuType(2);
                                            isSideMenu = true;
                                        }
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                        if (!isMainMenu && !isSideMenu) {
                            setSelectedMenuType(3);
                            if (res.data.customFilter) {
                                setSelectedModuleType(2);
                                let strArr = res.data.customFilter.split('?');
                                setDataType(strArr[0]);
                                let strArr2 = strArr[1].split(':');
                                setFieldType('?' + strArr2[0]);
                                setSortType(':' + strArr2[1]);
                            }
                            if (res.data.customSelection !== {}) {
                                setSelectedModuleType(1);
                                if (res.data.customSelection.articles.length > 0) {
                                    setSelectedArticles(res.data.customSelection.articles);
                                }
                                if (res.data.customSelection.categories.length > 0) {
                                    setSelectedCategories(res.data.customSelection.categories);
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        axios.get(apiUrl + "/api/articles")
            .then((res) => {
                if (res.data?.articles) {
                    setArticles(res.data.articles);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get(apiUrl + "/api/categories")
            .then((res) => {
                if (res.data) {
                    setCategories(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [menuId, apiUrl]);

    // SET DYNAMIC MENU OPTIONS
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
            setSelectedModuleType(0);
        }
    }, [selectedMenuType, selectedModuleType]);

    // SET DYNAMIC MODULE OPTIONS
    useEffect(() => {
        if (selectedModuleType === 1) {
            setDynamicModuleOptions((<>
                <FormControl fullWidth>
                    <InputLabel id="articles-mutiple-chip-label">Articles</InputLabel>
                    <Select
                        labelId="articles-mutiple-chip-label"
                        id="articles-mutiple-chip"
                        multiple
                        value={selectedArticles}
                        onChange={handleSelectedArticles}
                        input={<Input id="articles-select-multiple-chip" />}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value._id} label={value.title} className={classes.chip} />
                                ))}
                            </div>
                        )}
                    >
                        {articles.map((value) => (
                            <MenuItem key={value._id} value={value} style={getStyles(value, selectedArticles, theme)}>
                                {value.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id="categories-mutiple-chip-label">Categories</InputLabel>
                    <Select
                        labelId="categories-mutiple-chip-label"
                        id="categories-mutiple-chip"
                        multiple
                        value={selectedCategories}
                        onChange={(event) => { setSelectedCategories(event.target.value) }}
                        input={<Input id="categories-select-multiple-chip" />}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value._id} label={value.name} className={classes.chip} />
                                ))}
                            </div>
                        )}
                    >
                        {categories.map((value) => (
                            <MenuItem key={value._id} value={value} style={getStyles(value, selectedCategories, theme)}>
                                {value.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </>));
        } else if (selectedModuleType === 2) {
            setDynamicModuleOptions((<>
                <FormControl fullWidth>
                    <InputLabel id="data-type">Select Data Type</InputLabel>
                    <Select
                        labelId="data-type"
                        id="data-type-label"
                        fullWidth
                        value={dataType}
                        onChange={(event) => setDataType(event.target.value)}
                    >
                        <MenuItem value={'None'}>-- Select an Option --</MenuItem>
                        <MenuItem value={'/api/articles'}>Article</MenuItem>
                        <MenuItem value={'/api/categories'}>Category</MenuItem>
                    </Select>
                </FormControl>
                {dataType !== 'None' && (<FormControl fullWidth>
                    <InputLabel id="field-type">Select Field Type</InputLabel>
                    <Select
                        labelId="field-type"
                        id="field-type-label"
                        fullWidth
                        value={fieldType}
                        onChange={(event) => setFieldType(event.target.value)}
                    >
                        <MenuItem value={'None'}>-- Select an Option --</MenuItem>
                        <MenuItem value={'?' + (dataType === '/articles' ? ('title') : ('name'))}>Title</MenuItem>
                        <MenuItem value={'?datePosted'}>Date Posted</MenuItem>
                    </Select>
                </FormControl>)}
                {fieldType !== 'None' && (<FormControl fullWidth>
                    <InputLabel id="sort-type">Select Sort Type</InputLabel>
                    <Select
                        labelId="sort-type"
                        id="sort-type-label"
                        fullWidth
                        value={sortType}
                        onChange={(event) => setSortType(event.target.value)}
                    >
                        <MenuItem value={'None'}>-- Select an Option --</MenuItem>
                        <MenuItem value={':asc'}>Ascending</MenuItem>
                        <MenuItem value={':desc'}>Descending</MenuItem>
                    </Select>
                </FormControl>)}
            </>));
        } else {
            setDynamicModuleOptions(null);
        }
    }, [selectedModuleType, selectedMenuType, articles, selectedArticles, categories, selectedCategories,
        fieldType, dataType, sortType]);

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

    const saveMenu2 = async (event) => {
        event.preventDefault();
        setSaving(true);
        const body = {
            name
        }
        let apiPath = menuId ? ('/api/menus/update/' + menuId) : ('/api/menus/insert');
        try {
            const result = await axios.post(apiUrl + apiPath, body);
            console.log(result);
            let apiPath2;
            const body2 = {};
            if (result.data && result.data._id) {
                if (selectedMenuType === 1) {
                    apiPath2 = '/api/main-menu';
                    body2.menuId = menuId || result.data._id;
                } else if (selectedMenuType === 2) {
                    apiPath2 = '/api/side-menu';
                    body2.menuId = menuId || result.data._id;
                } else if (selectedMenuType === 3) {
                    apiPath2 = ('/api/menus/update/' + result.data._id);
                    if (selectedModuleType === 1) {
                        body2.customSelection = {};
                        body2.customSelection.articles = [];
                        selectedArticles.forEach((article) => {
                            body2.customSelection.articles.push(article._id);
                        });
                        body2.customSelection.categories = [];
                        selectedCategories.forEach((category) => {
                            body2.customSelection.categories.push(category._id);
                        });
                    } else if (selectedModuleType === 2) {
                        if (dataType === 'None' || fieldType === 'None' || sortType === 'None') {
                            console.log("Please select all fields");
                            return;
                        } else {
                            body2.customFilter = dataType + fieldType + sortType;
                        }
                    }
                } else {
                    console.log("Please select a menu type");
                    return;
                }

                const result2 = await axios.post(apiUrl + apiPath2, body2);
                console.log(result2);
                setSaving(false);
                history.push('/dashboard/menu-master/menus');
            }
        } catch (err) {
            setSaving(false);
            console.log(err);
        }
    }

    return (
        <>
            <Container maxWidth="md">
                <form onSubmit={saveMenu2}>
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