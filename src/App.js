import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import {
  withAuthentication,
  withAuthorization
} from "./components/Session";

import Chats from "./components/Chats";
import CssBaseline from "@material-ui/core/CssBaseline";
import Events from "./components/Events";
import HeaderBar from "./components/HeaderBar";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import MyProfile from "./components/MyProfile";
import SignInSide from "./components/SignInSide";
import SignUp from "./components/SignUp";
import { commonCondition } from "./utils/utils-function";
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

class App extends Component {
  render() {
    return (
      <Router>
        <CssBaseline />
        <HeaderBar />
        <Route
          exact
          path="/"
          component={withAuthorization(commonCondition)(Holidays)}
        />
        <Route
          path="/events"
          component={withAuthorization(commonCondition)(Events)}
        />
        <Route path="/chats" component={withAuthorization(commonCondition)(Chats)} />
        <Route
          path="/myProfile"
          component={withAuthorization(commonCondition)(MyProfile)}
        />
        <Route path="/sign-in" component={withFirebase(SignInSide)} />
        <Route path="/sign-up" component={withFirebase(SignUp)} />
      </Router>
    );
  }
}

export default withAuthentication(App);
