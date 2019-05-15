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
    return dateA - dateB;
  });
}

function sortNewToOld(data) {
  return data.sort(function(a, b) {
    const dateA = new Date(a.publicHolidayDate),
      dateB = new Date(b.publicHolidayDate);
    return dateB - dateA;
  });
}

const template = [
  { month: "January", data: [] },
  { month: "February", data: [] },
  { month: "March", data: [] },
  { month: "April", data: [] },
  { month: "May", data: [] },
  { month: "June", data: [] },
  { month: "July ", data: [] },
  { month: "August", data: [] },
  { month: "September", data: [] },
  { month: "October", data: [] },
  { month: "November ", data: [] },
  { month: "December", data: [] }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidaysData: sortOldToNew(data.holidays),
      sort: "old",
      cardData: template
    };

    this.selectChange = this.selectChange.bind(this);
    this.sortContent = this.sortContent.bind(this);
    this.groupMonth = this.groupMonth.bind(this);
  }

  componentDidMount() {
    axios
      .get(scgAPI)
      .then(response => {
        this.setState({ holidaysData: sortOldToNew(response.data) });
      })
      .then(() => this.groupMonth());
  }

  groupMonth = () => {
    const { holidaysData, cardData } = this.state;

    this.setState({
      cardData: cardData.map((item, index) => {
        item.data = holidaysData.filter(
          holiday => moment(holiday.publicHolidayDate).get("month") === index
        );
        return item;
      })
    });
  };

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

  renderCardGroup = () => {
    const { cardData } = this.state;
    return (
      <div className="row" key="animate1">
        {cardData.map(item => {
          return (
            <div className="col-sm-6" key={item.month}>
              <div className="card" style={{ margin: 10 }}>
                <div className="card-body holiday">
                  <h5 className="card-title">
                    <span role="img" aria-label="Calendar">
                      📅
                    </span>
                    {` ${item.month}`}
                  </h5>
                  <div className="card-text" style={{ minHeight: 100 }}>
                    <ul>
                      {item.data.map(subItem => (
                        <li key={subItem.publicHolidayDate}>
                          {` ${subItem.publicHolidayName} ${moment(
                            subItem.publicHolidayDate
                          ).format("MMMM Do YYYY")}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="App container">
        {/* <Demo children={<h1>Holidays!</h1>} /> */}
        <div className="row justify-content-md-center">
          <div className="col">
            <h1>Holidays!</h1>
          </div>
          <div className="col" />
          <div className="col">
            <select
              value={this.state.sort}
              onChange={this.selectChange}
              className="browser-default custom-select"
              style={{ width: 200 }}
            >
              <option value="old">first -> last</option>
              <option value="new">last -> first</option>
            </select>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.sortContent}
            >
              Sort
            </button>
          </div>
        </div>

        <QueueAnim delay={300}>
          {this.renderCardGroup()}
          {/* {holidaysData.map((item, index) => (
            <div key={index} className="holiday">
              <span role="img" aria-label="Calendar">
                📅
              </span>
              <span>Topic: {item.publicHolidayName}</span>
              <span>
                {moment(item.publicHolidayDate).format("MMMM Do YYYY")}
              </span>
            </div>
          ))} */}
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
