import axios from "axios";
import moment from "moment";
import React, { Component } from "react";
import swal from "sweetalert2";
import { withSwalInstance } from "sweetalert2-react";
import URL from "../../configs/url.json";

const SweetAlert = withSwalInstance(swal);

class HomeAlert extends Component {
  state = {
    show: false,
    acconuncmentData: {}
  };

  componentDidMount() {
    const now = moment();
    const year = now.format("YYYY");
    const month = now.format("MM");
    const url = `${URL.HolidaysAPI}/homeAcconuncment?year=${year}&month=${month}`;
    axios
      .get(url)
      .then(response =>
        this.setState({ acconuncmentData: response.data, show: true })
      )
      .catch(err => console.log(err));
  }

  render() {
    const { acconuncmentData } = this.state;
    return (
      <SweetAlert
        show={this.state.show}
        title={acconuncmentData.acconuncmentTitle}
        text={acconuncmentData.acconuncmentMessage}
        onConfirm={() => this.setState({ show: false })}
        type={acconuncmentData.acconuncmentType}
      />
    );
  }
}

export default HomeAlert;
