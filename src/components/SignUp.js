import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../svg/hammock.svg";
import Copyright from "./Copyright";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.grey[50]
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp(props) {
  const { firebase } = props;
  const classes = useStyles();

  const [submitting, setSubmitting] = React.useState(null);
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    errorMessage: null
  });

  const { vertical, horizontal, open, errorMessage } = state;

  const handleSubmit = event => {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(firstName, lastName, email, password);

    setSubmitting(true);
    firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(response => {
        console.log(response);
        setState({ ...state, open: true, errorMessage: "Sign up success!" });
        setSubmitting(false);
      })
      .catch(error => {
        console.log(error);
        const { message } = error;
        setState({ ...state, open: true, errorMessage: message });
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{errorMessage}</span>}
        autoHideDuration={6000}
      />
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src={Logo} height="100%" width="80%" alt="logo" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={submitting}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                <RouterLink to="/sign-in">
                  Already have an account? Sign in
                </RouterLink>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
