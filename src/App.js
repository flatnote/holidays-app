import { Layout } from "antd";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Events from "./components/Events";
import { withFirebase } from "./components/Firebase";
import HomeAlert from "./components/HomeAlert";
import Main from "./components/Main";
import MessageSocket from "./components/MessageSocket";
import Navigation from "./components/Navigation";
import URL from "./configs/url.json";

const { Header, Content, Footer } = Layout;

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
        <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
          <Layout className="layout">
            <Header>
              <Navigation />
            </Header>
            <Content>
              <Route exact path="/" component={Holidays} />
              <Route path="/events" component={Events} />
            </Content>
            <Footer className="footer">
              <p>
                Powered by
                <a href={URL.MyBlog}> Ball</a>
              </p>
            </Footer>
          </Layout>
          <MessageSocket />
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
