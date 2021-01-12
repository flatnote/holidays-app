import {
  AuthUserContext,
  withAuthentication,
  withAuthorization,
} from "./components/Session";
import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Chats from "./components/Chats";
import CssBaseline from "@material-ui/core/CssBaseline";
import Events from "./components/Events";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import MenuAppBar from "./components/MenuAppBar";
import MyProfile from "./components/MyProfile";
import SignInSide from "./components/SignInSide";
import SignUp from "./components/SignUp";
import { withFirebase } from "./components/Firebase";

class Holidays extends Component {
  render() {
    return (
      <React.Fragment>
        <HomeAlert />
        <Main {...this.props} />
      </React.Fragment>
    );
  }
}

const condition = (authUser) => !!authUser;

class WrapMenuAppBar extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          authUser ? (
            <MenuAppBar {...this.props} auth authUser={authUser} />
          ) : (
            ""
          )
        }
      </AuthUserContext.Consumer>
    );
  }
}

const WrapMenuAppBarFirebase = withFirebase(WrapMenuAppBar);

class App extends Component {
  render() {
    return (
      <Router>
        <CssBaseline />
        <WrapMenuAppBarFirebase />
        <Route
          exact
          path="/"
          component={withAuthorization(condition)(Holidays)}
        />
        <Route
          path="/events"
          component={withAuthorization(condition)(Events)}
        />
        <Route path="/chats" component={withAuthorization(condition)(Chats)} />
        <Route
          path="/myProfile"
          component={withAuthorization(condition)(MyProfile)}
        />
        <Route path="/sign-in" component={withFirebase(SignInSide)} />
        <Route path="/sign-up" component={withFirebase(SignUp)} />
      </Router>
    );
  }
}

export default withAuthentication(App);
