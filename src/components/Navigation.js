import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const menuClick = () => {
  const menu = document.querySelector(".menu");
  if (menu.className.indexOf("active") === -1) {
    menu.classList.add("active");
  } else {
    menu.classList.remove("active");
  }
};

class Navigation extends Component {
  render() {
    return (
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
            <Link to="/">
              <h2 style={{ color: "#fff" }}>Holidays</h2>
            </Link>
            <hr />
            <Link to="/events">
              <h2 style={{ color: "#fff" }}>Events</h2>
            </Link>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navigation;
