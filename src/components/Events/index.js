import React, { Component } from "react";
import AddEvent from "./AddEvent";
import ListEvent from "./ListEvent";

class index extends Component {
  render() {
    return (
      <div>
        <ListEvent />
        <AddEvent />
      </div>
    );
  }
}

export default index;
