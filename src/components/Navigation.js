import { Layout, Menu } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";

const { Header } = Layout;

class Navigation extends Component {
  render() {
    return (
      <Header>
        {/* <div className="logo" /> */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">
            <Link to="/">
              <b>Holidays</b>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/events">Events</Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default Navigation;
