import React from 'react';
import firebase from "../firebase";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#052d42'
  }
}));

export default function Navbar(props) {
  const classes = useStyles();
  const {user} = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Crypto Portfolio
          </Typography>
          { user &&
          <Button color="inherit" onClick={() => firebase.logout()}>Logout</Button> }
        </Toolbar>
      </AppBar>
    </div>
  );
}