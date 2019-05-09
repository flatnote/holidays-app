import React, { Component } from "react";
import "./App.css";
import data from "./jsonData/holidays.json";
import moment from "moment";
import Demo from "./Demo";
import TweenOne from "rc-tween-one";
import QueueAnim from "rc-queue-anim";

const TweenOneGroup = TweenOne.TweenOneGroup;

class App extends Component {
  render() {
    console.log(data.holidays);
    return (
      <div className="App">
        {/* <Demo children={<h1>Holidays!</h1>} /> */}
        <h1>Holidays!</h1>
        <QueueAnim delay={300}>
          {/* <div key="demo1">Queue entering</div>
          <div key="demo2">Queue entering</div>
          <div key="demo3">Queue entering</div>
          <div key="demo4">Queue entering</div> */}
          {data.holidays.map((item, index) => (
            <div key={index} className="holiday">
              <span>📅</span>
              <span>Topic: {item.publicHolidayName}</span>
              <span>
                {moment(item.publicHolidayDate).format("MMMM Do YYYY")}
              </span>
            </div>
          ))}
        </QueueAnim>
        {/* <TweenOneGroup>
          {data.holidays.map((item, index) => (
            <Demo
              key={index}
              children={
                <div className="holiday">
                  <span>Topic: {item.publicHolidayName}</span>
                  <span>
                    📅 {moment(item.publicHolidayDate).format("MMMM Do YYYY")}
                  </span>
                </div>
              }
            />
          ))}
        </TweenOneGroup> */}
      </div>
    );
  }
}

export default App;
