import axios from "axios";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
import React, { Component } from "react";
import Slider from "react-slick";
import URL from "../configs/url.json";
import loadingImg from "../svg/Interwind-1s-200px.svg";
import { withFirebase } from "./Firebase";

class Main extends Component {
  constructor(props) {
    super(props);

    console.log(props.firebase);

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

  async componentDidMount() {
    this.getHolidayData();
    const { firebase, history } = this.props;
    // console.log(history);
    // firebase.onAuthUserListener(
    //   authUser => {
    //     console.log(authUser);
    //     // if (authUser) {
    //     //   this.props.history.push(ROUTES.SIGN_IN);
    //     // }
    //   },
    //   () => {
    //     history.push("/sign-in");
    //   }
    // );
    // this.props.firebase.askForPermissioToReceiveNotifications();
  }

  synchronizeData = async () => {
    this.setState({ loading: true });
    const data = await this.getDatabase();
    const scgData = await this.getScgData();

    if (data && scgData && data.length !== scgData.length) {
      const url = `${URL.HolidaysAPI}/insert`;
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
    const url = `${URL.HolidaysAPI}/all?year=${yearSeleced}&grouping=true`;
    return axios.get(url).then(response => response.data);
  };

  getScgData = () => {
    const { yearSeleced } = this.state;
    const url = `${URL.ScgAPI}?years=${yearSeleced}`;
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
                            "ddd Do MMMM YYYY"
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

  render() {
    return (
      <div className="container">
        <QueueAnim delay={300}>{this.renderCardGroup()}</QueueAnim>
      </div>
    );
  }
}

export default withFirebase(Main);
