import axios from "axios";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
// import TweenOne from "rc-tween-one";
import React, { Component } from "react";
import "./App.css";
import data from "./jsonData/holidays.json";

// const TweenOneGroup = TweenOne.TweenOneGroup;
const scgAPI =
  "https://scgchem-mdm.scg.com/v1.0/Api/MDM/GetAllPublicHolidaysByYears?years=2019";

class App extends Component {
  state = {
    holidaysData: data.holidays
  };

  componentDidMount() {
    axios.get(scgAPI).then(response => {
      this.setState({ holidaysData: response.data });
    });
  }

  render() {
    const { holidaysData } = this.state;

    return (
      <div className="App">
        {/* <Demo children={<h1>Holidays!</h1>} /> */}
        <h1>Holidays!</h1>
        <QueueAnim delay={300}>
          {/* <div key="demo1">Queue entering</div>
          <div key="demo2">Queue entering</div>
          <div key="demo3">Queue entering</div>
          <div key="demo4">Queue entering</div> */}
          {holidaysData.map((item, index) => (
            <div key={index} className="holiday">
              <span role="img" aria-label="Calendar">
                📅
              </span>
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
