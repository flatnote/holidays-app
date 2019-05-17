import axios from "axios";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
// import TweenOne from "rc-tween-one";
import React, { Component } from "react";
import "./App.css";
import data from "./jsonData/holidays.json";

// const TweenOneGroup = TweenOne.TweenOneGroup;
const scgAPI =
  "https://scgchem-mdm.scg.com/v1.0/Api/MDM/GetAllPublicHolidaysByYears";

function sortFirstToLast(listData) {
  return listData.sort(function(first, second) {
    const dateFirst = new Date(first.publicHolidayDate),
      dateSecond = new Date(second.publicHolidayDate);
    return dateFirst - dateSecond;
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
      holidaysData: sortFirstToLast(data.holidays),
      yearSeleced: moment().year(),
      cardData: template,
      options: []
    };

    this.selectChange = this.selectChange.bind(this);
    this.groupMonth = this.groupMonth.bind(this);
    this.prepareOption = this.prepareOption.bind(this);
    this.getHolidayData = this.getHolidayData.bind(this);
  }

  componentDidMount() {
    this.getHolidayData();
  }

  getHolidayData = () => {
    const { yearSeleced } = this.state;
    const url = `${scgAPI}?years=${yearSeleced}`;
    axios
      .get(url)
      .then(response => {
        this.setState({ holidaysData: sortFirstToLast(response.data) });
      })
      .then(() => this.groupMonth())
      .catch(() => {
        this.groupMonth();
      });
  };

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
    this.setState({ yearSeleced: event.target.value });
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
                          ).format("Do MMMM YYYY")}`}
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

  prepareOption = () => {
    const min = moment().year() - 10;
    const max = moment().year() + 10;

    let optionComponent = [];
    for (let index = min; index < max; index++) {
      optionComponent.push(index);
    }

    return optionComponent.map(item => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  };

  render() {
    return (
      <div className="App container">
        {/* <Demo children={<h1>Holidays!</h1>} /> */}
        <div className="row justify-content-md-center">
          <div className="col">
            <h1>Holidays!</h1>
          </div>
          <div className="col">
            <select
              value={this.state.yearSeleced}
              onChange={this.selectChange}
              className="browser-default custom-select"
              style={{ width: 100 }}
            >
              {this.prepareOption()}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.getHolidayData}
              style={{ marginLeft: 10 }}
            >
              Change year
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
