import React, { Component } from "react";
import TweenOne from "rc-tween-one";
import PropTypes from "prop-types";

class Demo extends Component {
  constructor(props) {
    super(props);
    this.moment = null;
    this.animation = [
      { left: "-40%" },
      { left: "40%" },
      { top: "60px" },
      { scale: 0.7 },
      { scale: 1 },
      { top: 0 },
      { left: "0%" }
    ];
  }

  render() {
    return (
      <TweenOne
        animation={this.animation}
        paused={this.props.paused}
        repeat={-1}
        yoyo
        style={{ transform: "scale(1)" }}
        className="code-box-shape"
      >
        {this.props.children}
      </TweenOne>
    );
  }
}
Demo.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  paused: PropTypes.bool
};

export default Demo;
