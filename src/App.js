import axios from "axios";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
import React, { Component } from "react";
import "./App.css";
import loadingImg from "./svg/Interwind-1s-200px.svg";
import MessageSocket from "./components/MessageSocket";
import { withFirebase } from "./components/Firebase";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import Login from "./components/Login";
import swal from "sweetalert2";
import { withSwalInstance } from "sweetalert2-react";
import Slider from "react-slick";

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

const srcImgs = [
  {
    src:
      "https://i.pinimg.com/564x/e9/e6/e8/e9e6e8d32e784d3ebdb2259d2016dfb6.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/2c/64/65/2c6465f406fe78a4dcbb9ee898793b26.jpg",
    titleClass: "card_title title-white",
    bodyClass: "card-text title-white"
  },
  {
    src:
      "https://i.pinimg.com/564x/8c/d0/a7/8cd0a7dd98109ad4554e9ab62171435b.jpg",
    titleClass: "card_title title-white",
    bodyClass: "card-text title-white"
  },
  {
    src:
      "https://i.pinimg.com/564x/4f/12/01/4f1201475f701da83a0958f6dadd57a7.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/e6/65/d4/e665d4c8f993cc059091dd4c247a2183.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/19/30/86/19308619265bd811961997bbe9f30373.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/df/35/77/df3577ff067e0c7e2289fb7c30090c19.jpg",
    titleClass: "card_title title-white",
    bodyClass: "card-text title-white"
  },
  {
    src:
      "https://i.pinimg.com/564x/eb/49/b4/eb49b4459725d04923287b916edb841d.jpg",
    titleClass: "card_title title-white",
    bodyClass: "card-text title-white"
  },
  {
    src:
      "https://i.pinimg.com/564x/f6/d4/19/f6d41913be89809aae005189ce9ec8ee.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/a2/bb/f8/a2bbf8cfe59bda4fc8890ad28460cff8.jpg",
    titleClass: "card_title title-white",
    bodyClass: "card-text title-white"
  },
  {
    src:
      "https://i.pinimg.com/564x/e3/8d/b2/e38db2ef17616edeee08e05e0910bf4f.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  },
  {
    src:
      "https://i.pinimg.com/564x/1e/f0/e5/1ef0e535626599dcfca4625c0ce7522b.jpg",
    titleClass: "card_title title-black",
    bodyClass: "card-text title-black"
  }
];

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

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidaysData: [],
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
    // this.props.firebase.askForPermissioToReceiveNotifications();
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
    const { yearSeleced } = this.state;
    const url = `${dataBaseAPI}/all?year=${yearSeleced}`;
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

    const now = moment();
    const month = now.format("MM");

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: parseInt(month) - 1
      // adaptiveHeight: true
    };

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
      <div key="animate1" style={{ marginBottom: "5em" }}>
        <Slider {...settings}>
          {cardData.map((item, index) => {
            return (
              <div className="card" key={item.month}>
                <div className="card_image">
                  <img src={srcImgs[index].src} alt={`card ${index}`} />{" "}
                </div>
                <div className={srcImgs[index].titleClass}>
                  <span role="img" aria-label="Calendar">
                    📅
                  </span>
                  {` ${item.month}`}
                </div>
                <div
                  className={srcImgs[index].bodyClass}
                  style={{ minHeight: 100 }}
                >
                  <ul>
                    {item.data.map(subItem => (
                      <li key={subItem.publicHolidayDate}>
                        <span>{subItem.publicHolidayName} </span>
                        <span style={{ color: "#e44f24", fontWeight: 700 }}>
                          {moment(subItem.publicHolidayDate).format(
                            "Do MMMM YYYY"
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </Slider>
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
      <div className="container" style={{ padding: 20 }}>
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
            {/* <img
              className="synchronize-btn"
              src="https://img.icons8.com/flat_round/32/000000/synchronize.png"
              onClick={this.synchronizeData}
              style={{ marginLeft: 10 }}
              alt="synchronize-btn"
            /> */}
            <img
              className="synchronize-btn"
              src="https://img.icons8.com/flat_round/32/000000/synchronize.png"
              onClick={() => window.location.reload(true)}
              style={{ marginLeft: 10 }}
              alt="synchronize-btn"
            />
          </div>
        </div>

        <QueueAnim delay={300}>{this.renderCardGroup()}</QueueAnim>
        <footer>
          <div className="footer">
            <p>
              Powered by
              <a href="https://compassionate-pike-7765dd.netlify.com/"> Ball</a>
            </p>
          </div>
        </footer>

        <MessageSocket />
      </div>
    );
  }
}

const SweetAlert = withSwalInstance(swal);

class App extends Component {
  state = {
    show: false,
    acconuncmentData: {}
  };

  componentDidMount() {
    const now = moment();
    const year = now.format("YYYY");
    const month = now.format("MM");
    const url = `${dataBaseAPI}/homeAcconuncment?year=${year}&month=${month}`;
    axios
      .get(url)
      .then(response =>
        this.setState({ acconuncmentData: response.data, show: true })
      );
  }

  render() {
    const { acconuncmentData } = this.state;
    return (
      <Router>
        <div>
          <SweetAlert
            show={this.state.show}
            title={acconuncmentData.acconuncmentTitle}
            text={acconuncmentData.acconuncmentMessage}
            onConfirm={() => this.setState({ show: false })}
            type={acconuncmentData.acconuncmentType}
          />
          <Route exact path="/" component={Main} />
          {/* <Route path="/sign-in" component={Login} /> */}
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
