import React, { Component } from "react";
import ListEvent from "./ListEvent";
import AddEvent from "./AddEvent";

class index extends Component {
  render() {
    return (
      <div>
        <AddEvent />
        <ListEvent />
      </div>
    );
  }
}

export default index;
