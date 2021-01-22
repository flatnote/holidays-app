import React, { Component } from "react";

import moment from "moment";

class HolidayCard extends Component {
  render() {
    const { cardData, index } = this.props;
    return (
      <div className="card" key={cardData.month}>
        <div className="card_image">
          <img src={cardData.bgUrl} alt={`card ${index}`} />{" "}
        </div>
        <div className="card_title">
          <span role="img" aria-label="Calendar">
            📅
          </span>
          {` ${cardData.month}`}
        </div>
        <div className="card-text">
          <ul>
            {cardData.data.map((subItem) => (
              <li key={subItem.publicHolidayDate}>
                <span>{subItem.publicHolidayName} </span>
                <span className="card-text-date">
                  {moment(subItem.publicHolidayDate).format("ddd Do MMMM YYYY")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default HolidayCard;
