import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import { loadCSS } from "fg-loadcss";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../svg/hammock.svg";
import Copyright from "./Copyright";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignInSide(props) {
  const { firebase, history } = props;

  const classes = useStyles();

  React.useEffect(() => {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );
  }, []);

  const [submitting, setSubmitting] = React.useState(null);
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    errorMessage: null
  });

  const { vertical, horizontal, open, errorMessage, variant } = state;

  const handleSubmit = event => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setSubmitting(true);
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(response => {
        console.log(response);
        if (response) {
          history.push("/");
        }
        setSubmitting(false);
      })
      .catch(error => {
        const { message } = error;
        console.log(error);
        setState({
          ...state,
          open: true,
          errorMessage: message
        });
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleSIgnInGoogle = () => {
    firebase.doSignInWithGoogle().then(response => {
      console.log(response);
      if (response) {
        history.push("/");
      }
    });
  };

  return (
    <Grid container component="main" className={classes.root}>
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
        va
      />
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <img src={Logo} height="100%" width="80%" alt="logo" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to Holidays app !
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={submitting}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleSIgnInGoogle}
              startIcon={<Icon className="fab fa-google" />}
            >
              Sign In with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  <RouterLink to="/sign-up">
                    {"Don't have an account? Sign Up"}
                  </RouterLink>
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
