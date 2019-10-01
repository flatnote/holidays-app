import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withFirebase } from "./components/Firebase";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import Events from "./components/Events";
import Navigation from "./components/Navigation";
import MessageSocket from "./components/MessageSocket";
import URL from "./configs/url.json";
import "./App.css";

const Holidays = () => {
  return (
    <div>
      <HomeAlert />
      <Main />
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: "100vh", width: "100vw" }}>
          <Navigation />
          <Route exact path="/" component={Holidays} />
          <Route path="/events" component={Events} />
          <footer>
            <div className="footer">
              <p>
                Powered by
                <a href={URL.MyBlog}> Ball</a>
              </p>
            </div>
          </footer>
          <MessageSocket />
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
