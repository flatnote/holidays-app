import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { withFirebase } from "./components/Firebase";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <HomeAlert />
          <Route exact path="/" component={Main} />
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
