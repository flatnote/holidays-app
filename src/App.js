import axios from "axios";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
// import TweenOne from "rc-tween-one";
import React, { Component } from "react";
import "./App.css";
import localData from "./jsonData/holidays.json";
import loadingImg from "./svg/Interwind-1s-200px.svg";

// const TweenOneGroup = TweenOne.TweenOneGroup;
const scgAPI =
  "https://scgchem-mdm.scg.com/v1.0/Api/MDM/GetAllPublicHolidaysByYears";

const dataBaseAPI = "https://line-noti-bot.herokuapp.com/api/holidays";

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
      holidaysData: sortFirstToLast(localData.holidays),
      yearSeleced: moment().year(),
      cardData: template,
      options: [],
      loading: false
    };

    this.selectChange = this.selectChange.bind(this);
    this.groupMonth = this.groupMonth.bind(this);
    this.prepareOption = this.prepareOption.bind(this);
    this.getHolidayData = this.getHolidayData.bind(this);
    this.synchronizeData = this.synchronizeData.bind(this);
  }

  componentDidMount = () => {
    this.getHolidayData();
  };

  synchronizeData = async () => {
    this.setState({ loading: true });
    const data = await this.getDatabase();
    const scgData = await this.getScgData();

    if (data && scgData && data.length !== scgData.length) {
      const url = `${dataBaseAPI}/insert`;
      for (let index = 0; index < scgData.length; index++) {
        const element = scgData[index];
        await axios.post(url, element).then(response => console.log(response));
      }
    }

    await this.getHolidayData();

    this.setState({ loading: false });
  };

  getDatabase = () => {
    const url = `${dataBaseAPI}/all`;
    return axios.get(url).then(response => response.data);
  };

  getScgData = () => {
    const { yearSeleced } = this.state;
    const url = `${scgAPI}?years=${yearSeleced}`;
    return axios.get(url).then(response => response.data);
  };

  getHolidayData = async () => {
    this.setState({ loading: true });
    const data = await this.getDatabase();
    this.setState(
      { holidaysData: sortFirstToLast(data), loading: false },
      this.groupMonth
    );
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
    const { cardData, loading } = this.state;

    return loading ? (
      <img
        src={loadingImg}
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          width: "50%"
        }}
        alt="loading"
      />
    ) : (
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
        <div className="row">
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
            <img
              className="synchronize-btn"
              src="https://img.icons8.com/flat_round/32/000000/synchronize.png"
              onClick={this.synchronizeData}
              style={{ marginLeft: 10 }}
              alt="synchronize-btn"
            />
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
        <footer>
          <div className="container" style={{ textAlign: "center" }}>
            <p>
              Powered by
              <a href="."> Ball</a>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
