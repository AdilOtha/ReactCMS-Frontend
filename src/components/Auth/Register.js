import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from '../../interceptors/auth.interceptor';

require('dotenv').config();

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

export default function Register() {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');

    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const registerSubmit = (event)=>{
        event.preventDefault();
        const body={
            fname,
            lname,
            email,
            password,
        };

        axios.post(`${apiUrl}/api/auth/register`,body)
            .then(res=>{
                localStorage.setItem("token", res.data.token);
            })
            .catch((err)=>{
                if(err.response) {
                    console.log(err.response);
                }
            });
    }

    return (
        <>
            <Grid container justify="center" alignContent="center">
                <Grid item xs={10} sm={8} md={4} lg={3}>
                    <div className={classes.root}>
                        <Paper className={classes.paper}>
                            <form onSubmit={registerSubmit}>
                                <Grid container justify="center" alignItems="center">
                                    <Grid item xs={10}>
                                        <Typography variant="body1" align="center" gutterBottom={true}>
                                            Welcome to React CMS!
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography variant="h6" align="center">
                                            Register
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="text"
                                        onChange={(event)=>{setFname(event.target.value)}} name="fname" label="First Name" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="text"
                                        onChange={(event)=>{setLname(event.target.value)}} name="lname" label="Last Name" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="email"
                                        onChange={(event)=>{setEmail(event.target.value)}} label="Email" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField required fullWidth margin="dense" type="password"
                                        onChange={(event)=>{setPassword(event.target.value)}} label="Password" variant="outlined" />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <hr />
                                        <Button type="submit" fullWidth size="medium" color="primary" variant="contained">Sign Up</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography align="center">
                                            Or<br />Already a member?<br />
                                        </Typography>
                                        <Typography align="center">
                                            <Link to={'/'}>Login</Link>
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
