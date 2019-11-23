import CssBaseline from "@material-ui/core/CssBaseline";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Events from "./components/Events";
import { withFirebase } from "./components/Firebase";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import { withAuthentication, withAuthorization } from "./components/Session";
import SignInSide from "./components/SignInSide";
import SignUp from "./components/SignUp";
import MenuAppBar from "./components/MenuAppBar";

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

const condition = authUser => !!authUser;

class App extends Component {
  render() {
    return (
      <Router>
        <CssBaseline />
        <MenuAppBar {...this.props} auth />
        <Route
          exact
          path="/"
          component={withAuthorization(condition)(Holidays)}
        />
        <Route
          path="/events"
          component={withAuthorization(condition)(Events)}
        />
        <Route path="/sign-in" component={withFirebase(SignInSide)} />
        <Route path="/sign-up" component={withFirebase(SignUp)} />
        {/* <div style={{ height: "100vh", width: "100vw" }}>
          <Navigation />
          <Route exact path="/" component={Holidays} />
          <Route path="/events" component={Events} />
          <TemporaryDrawer />
          <MessageSocket />
          <div className="footer">
            <p>
              Powered by
              <a href={URL.MyBlog}> Ball</a>
            </p>
          </div>
        </div> */}
      </Router>
    );
  }
}

export default withAuthentication(App);
