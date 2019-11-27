import React, { Component } from "react";
import AddEvent from "./AddEvent";
import ListEvent from "./ListEvent";
import axios from "axios";

class index extends Component {
  state = {
    events: [],
    loading: false,
    noevent: false
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.fetchData();
    this.setState({ loading: false });
  }

  fetchData = async () => {
    const { firebase } = this.props;

    const randomImgs = await axios
      .get(
        `https://picsum.photos/v2/list?page=${Math.floor(
          Math.random() * 11
        )}&limit=100`
      )
      .then(response => response.data)
      .catch(error => console.log(error));

    const eventsRef = firebase
      .events()
      .orderByKey()
      .limitToLast(100);

    eventsRef.on("value", snapshot => {
      const valueObject = snapshot.val();
      let events = [];

      Object.keys(valueObject).forEach(key =>
        events.push({ key, ...valueObject[key] })
      );

      events = events.map((event, index) => {
        return {
          key: event.key,
          title: event.title,
          description: event.description,
          date: event.date,
          imgData: randomImgs[index]
        };
      });
      this.setState({ events });
    });
  };

  render() {
    const { events, loading, noevent } = this.state;
    return (
      <div>
        <ListEvent events={events} loading={loading} noevent={noevent} />
        <AddEvent events={events} loading={loading} noevent={noevent} />
      </div>
    );
  }
}

export default index;
