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

function sortOldToNew(data) {
  return data.sort(function(a, b) {
    const dateA = new Date(a.publicHolidayDate),
      dateB = new Date(b.publicHolidayDate);
    return dateB - dateA;
  });
}

function sortNewToOld(data) {
  return data.sort(function(a, b) {
    const dateA = new Date(a.publicHolidayDate),
      dateB = new Date(b.publicHolidayDate);
    return dateA - dateB;
  });
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidaysData: sortNewToOld(data.holidays),
      sort: "old"
    };

    this.selectChange = this.selectChange.bind(this);
    this.sortContent = this.sortContent.bind(this);
  }

  componentDidMount() {
    axios.get(scgAPI).then(response => {
      this.setState({ holidaysData: sortNewToOld(response.data) });
    });
  }

  selectChange(event) {
    this.setState({ sort: event.target.value });
  }

  sortContent() {
    const { sort, holidaysData } = this.state;
    if (sort === "old") {
      this.setState({ holidaysData: sortOldToNew(holidaysData) });
    }

    if (sort === "new") {
      this.setState({ holidaysData: sortNewToOld(holidaysData) });
    }
  }

  render() {
    const { holidaysData } = this.state;

    return (
      <div className="App container">
        {/* <Demo children={<h1>Holidays!</h1>} /> */}
        {/* <h2>{this.state.sort}</h2> */}
        <div class="row justify-content-md-center">
          <div class="col">
            <h1>Holidays!</h1>
          </div>
          <div class="col" />
          <div class="col">
            <select
              value={this.state.sort}
              onChange={this.selectChange}
              className="browser-default custom-select"
              style={{ width: 200 }}
            >
              <option value="old">old -> new</option>
              <option value="new">new -> old</option>
            </select>
            <button
              type="button"
              class="btn btn-primary"
              onClick={this.sortContent}
            >
              Sort
            </button>
          </div>
        </div>
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
