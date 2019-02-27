import React, { Component } from "react";
import "./App.css";
import data from "./jsonData/holidays.json";

class App extends Component {
  render() {
    console.log(data.holidays);
    return (
      <div className="App">
        <h1>Holidays!</h1>
        {data.holidays.map((item, index) => (
          <div key={index} className="holiday">
            <span>Topic: {item.publicHolidayName}</span>
            <span>
              📅 วัน {item.dayOfWeek} ท่ี {item.publicHolidayDate}
            </span>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
