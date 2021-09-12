import React, { useState } from 'react'
import { useFormik } from 'formik'
import validationSignupSchema from './validation/validationSignupSchema'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import firebase from '../firebase'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        maxWidth: '400px',
        margin: 'auto',
    },
    grid: {
        margin: 'auto'
    },
    error: {
        color: 'red',
        margin: 'auto',
        textAlign: 'center'
    }
});


function SignUp(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const { toggle } = props;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
    validationSchema: validationSignupSchema,
    onSubmit: (values, { resetForm }) => {
      firebase
        .register(values.name, values.email, values.password)
        .then(setError(null), resetForm({ values: '' }))
        .catch((err) => {
          switch(err.code) {
            case 'auth/network-request-failed':
              setError('No Internet Connection Detected!');
              break;
            default:
              setError('Something went wrong!');
              break;
          }
        });
    },
  });

  return (
    <Paper elevation={20} className={classes.root}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item style={{ margin: 'auto' }} xs={10}>
            <Typography align="center" variant="h3">
              Sign Up
            </Typography>
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <TextField
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              label="Name"
              name="name"
              size="small"
              variant="outlined"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <TextField
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              label="Email"
              name="email"
              size="small"
              variant="outlined"
              autoComplete="email"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <TextField
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              label="Password"
              name="password"
              size="small"
              type="password"
              variant="outlined"
              autoComplete="new-password"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <TextField
              fullWidth
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              label="Confirm Password"
              name="confirmPassword"
              size="small"
              type="password"
              variant="outlined"
              autoComplete="new-password"
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            {error ? (
              <p className={classes.error}>
                {error}
              </p>
            ) : null}
            <Button
              color="secondary"
              fullWidth
              type="submit"
              variant="contained"
            >
              Sign Up
            </Button>
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <Button fullWidth onClick={toggle(false)}>
              Already have an Account ?
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default SignUp
