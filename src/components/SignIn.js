import React, { useState } from "react";
import firebase from "../firebase";
import { useFormik } from "formik";
import validationLoginSchema from "./validation/validationLoginSchema";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: "400px",
    margin: "5px",
    padding: "20px",
  },
  grid: {
    margin: "auto",
  },
  error: {
    color: "red",
    margin: "auto",
    textAlign: "center",
  },
});

function SignIn(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toggle } = props;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationLoginSchema,
    onSubmit: (values, { resetForm }) => {
      firebase
        .login(values.email, values.password)
        .then(setError(null), setLoading(true))
        .catch((err) => {
          setLoading(false);
          setError("Email or Password Invalid");
        });
    },
  });

  return (
    <Paper elevation={20} className={classes.root}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item className={classes.grid} xs={10}>
            <Typography align="center" variant="h4">
              Sign-In
            </Typography>
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <TextField
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              label="Email"
              name="email"
              size="small"
              required
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
              required
              label="Password"
              name="password"
              size="small"
              type="password"
              variant="outlined"
              autoComplete="current-password"
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            {error && <p className={classes.error}>{error}</p>}
            <Button
              disabled={loading}
              color="secondary"
              fullWidth
              type="submit"
              variant="contained"
            >
              Log in
            </Button>
          </Grid>
          <Grid className={classes.grid} item xs={10}>
            <Button fullWidth onClick={toggle(true)}>
              Or Create an Account
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default SignIn;
