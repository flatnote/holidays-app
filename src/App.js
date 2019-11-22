import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Events from "./components/Events";
import { withFirebase } from "./components/Firebase";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import MessageSocket from "./components/MessageSocket";
import Navigation from "./components/Navigation";
import URL from "./configs/url.json";
import "./App.css";
import TemporaryDrawer from "./components/Drawers";
import SignInSide from "./components/SignInSide";
import SignUp from "./components/SignUp";

const Holidays = props => {
  return (
    <div style={{ marginBottom: 20 }}>
      <HomeAlert />
      <Main {...props} />
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <Router hi>
        <Route exact path="/" component={Holidays} />
        <Route path="/sign-in" component={withFirebase(SignInSide)} />
        <Route path="/sign-up" component={withFirebase(SignUp)} />
        <Route path="/events" component={Events} />
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

export default withFirebase(App);
