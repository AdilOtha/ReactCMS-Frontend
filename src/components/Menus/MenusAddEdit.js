import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, useParams, useHistory } from 'react-router-dom';

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

    // if (menuId) {
    //     setIsEdit(true);
    // }

    useEffect(() => {
        if (menuId) {
            axios.get(apiUrl + "/api/menus/" + menuId)
                .then(res => {
                    console.log(res);
                    setName(res.data.name);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [menuId, apiUrl]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const saveMenu = async (event) => {
        event.preventDefault();
        setSaving(true);
        let apiPath = '';
        const body = {
            name: name
        }
        if (menuId) {
            apiPath = '/api/menus/update/' + menuId;
        } else {
            apiPath = '/api/menus/insert';
        }
        try {
            const result = await axios.post(apiUrl + apiPath, body);
            console.log(result);
            setSaving(false);
            history.push('/menu-master/menus');
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
                                {menuId ? (<TextField margin="dense" fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event)=>handleNameChange(event)}
                                    value={name || ''} />)
                                    : (<TextField margin="dense" fullWidth={true} id="outlined-basic" label="Name" variant="outlined" onChange={(event)=>handleNameChange(event)} />)}
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={6}>
                                <Button type="submit" variant="contained" color="primary" disabled={saving}>
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Link to="/menu-master/menus" style={{ textDecoration: 'none' }}>
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