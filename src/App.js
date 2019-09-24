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

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidaysData: [],
      yearSeleced: moment().year(),
      cardData: [],
      options: [],
      loading: false
    };

    this.selectChange = this.selectChange.bind(this);
    // this.prepareOption = this.prepareOption.bind(this);
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
    const url = `${dataBaseAPI}/all?year=${yearSeleced}&grouping=true`;
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
    this.setState({ cardData: data, loading: false });
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
      <div key="animate1">
        <Slider {...settings}>
          {cardData.map((item, index) => {
            return (
              <div className="card" key={item.month}>
                <div className="card_image">
                  <img src={item.bgUrl} alt={`card ${index}`} />{" "}
                </div>
                <div className={item.titleClass}>
                  <span role="img" aria-label="Calendar">
                    📅
                  </span>
                  {` ${item.month}`}
                </div>
                <div className={item.bodyClass} style={{ minHeight: 100 }}>
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

  // prepareOption = () => {
  //   const min = moment().year() - 10;
  //   const max = moment().year() + 10;

  //   let optionComponent = [];
  //   for (let index = min; index < max; index++) {
  //     optionComponent.push(index);
  //   }

  //   return optionComponent.map(item => (
  //     <option key={item} value={item}>
  //       {item}
  //     </option>
  //   ));
  // };

  render() {
    return (
      <div className="container" style={{ padding: 20 }}>
        <div className="row">
          <div className="col col-sm-2 col-lg-2">
            <h1>Holidays!</h1>
          </div>
          <div className="refash-btn col offset-sm-4 col-sm-6 offset-lg-8 col-lg-2">
            {/* <select
              value={this.state.yearSeleced}
              onChange={this.selectChange}
              className="browser-default custom-select"
              style={{ width: 100 }}
            >
              {this.prepareOption()}
            </select> */}
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={this.getHolidayData}
              style={{ marginLeft: 10 }}
            >
              Change year
            </button> */}
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
