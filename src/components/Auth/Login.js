import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import auth from "../../models/Auth";
import axios from '../../interceptors/auth.interceptor';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        margin: 'auto',
        marginTop: '0.5rem',
        width: '95%',
        marginBottom: theme.spacing(2),
        padding: 16
    },
    card: {
        padding: 16,
    },
    cardHeader: {
        paddingBottom: 0
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

export default function Login(props) {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const loginSubmit = (event) => {
        event.preventDefault();
        const body = {
            email,
            password,
        };
        axios.post(`${apiUrl}/api/auth/login`, body)
            .then((res) => {
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
                auth.login(() => {
                    props.history.push("/dashboard");
                });
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response);
                }
            });
    }

    return (
        <>
            <Grid container justify="center" alignContent="center">
                <Grid item xs={10} sm={6} md={4} lg={3}>
                    <div className={classes.root}>
                        <Paper className={classes.paper}>
                            <form onSubmit={loginSubmit}>
                                <Grid container justify="center" alignItems="center">
                                    <Grid item xs={10}>
                                        <Typography variant="body1" align="center" gutterBottom={true}>
                                            Welcome to React CMS!
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="h6" align="center">
                                            Login
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="email"
                                            onChange={(event) => { setEmail(event.target.value) }} name="email" label="Email" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="password"
                                            onChange={(event) => { setPassword(event.target.value) }} name="password" label="Password" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <hr />
                                        <Button type="submit" fullWidth size="medium" color="primary" variant="contained">Login</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="center">
                                            Or<br />Not a member?<br />
                                            <Link to={'/register'}>Register</Link>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
