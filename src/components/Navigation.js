import { Layout } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const { Header } = Layout;

const menuClick = () => {
  const menu = document.querySelector(".menu");
  const root = document.getElementById("root");
  if (menu.className.indexOf("active") === -1) {
    menu.classList.add("active");
    root.classList.add("active-color");
  } else {
    menu.classList.remove("active");
    root.classList.remove("active-color");
  }
};

class Navigation extends Component {
  componentDidMount() {}

  render() {
    return (
      <Header>
        <div className="menu">
          <button
            className="nav-tgl"
            type="button"
            aria-label="toggle menu"
            onClick={menuClick}
          >
            <span aria-hidden="true"></span>
          </button>
          <nav className="nav">
            <ul>
              <div>
                <Link to="/">
                  <h2 style={{ color: "#fff" }}>Holidays</h2>
                </Link>
              </div>
              <hr />
              <div>
                <Link to="/events">
                  <h2 style={{ color: "#fff" }}>Events</h2>
                </Link>
              </div>
            </ul>
          </nav>
        </div>
      </Header>
    );
  }
}

export default Navigation;
