import React, { Component } from "react";
import AddEvent from "./AddEvent";
import ListEvent from "./ListEvent";

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
