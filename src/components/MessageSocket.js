import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Launcher } from "react-chat-window";
import "./Main.css";

import { withFirebase } from "./Firebase";

const socketEndpoint = "https://socket-holidays-chat.herokuapp.com";

class Demo extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [
        {
          author: "them",
          type: "text",
          data: {
            text: "some text"
          }
        }
      ],
      endpoint: socketEndpoint,
      messages: []
    };
    this._onMessageWasSent = this._onMessageWasSent.bind(this);
  }

  componentDidMount = () => {
    const { firebase } = this.props;
    const messagesRef = firebase
      .chatMessage()
      .orderByKey()
      .limitToLast(100);

    messagesRef.on("value", snapshot => {
      let messagesObj = snapshot.val();
      let messages = [];
      Object.keys(messagesObj).forEach(key => messages.push(messagesObj[key]));
      messages = messages.map(message => {
        // console.log(message);
        return { text: message.text, user: message.user, id: message.key };
      });
      this.setState(prevState => ({
        messages: messages
      }));
    });
    this.socketResponse();
  };

  // รอรับข้อมูลเมื่อ server มีการ update
  socketResponse = () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("new-message", messageList => {
      this.setState({ messageList });
    });
  };

  _onMessageWasSent(message) {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.emit("sent-message", message);
  }

  delete = () => {
    const socket = socketIOClient(socketEndpoint);
    socket.emit("delete-all-message");
  };

  render() {
    const { messageList, messages } = this.state;
    // console.log(messages);
    return (
      <div className="customLinkColor">
        <Launcher
          agentProfile={{
            teamName: "Chit-Chat",
            imageUrl:
              "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
          }}
          onMessageWasSent={this._onMessageWasSent}
          messageList={messageList}
          showEmoji
        />

        {/* <button type="button" onClick={this.delete} className="btn btn-danger">
          Delete All message
        </button> */}
      </div>
    );
  }
}

const ComposeFirebase = withFirebase(Demo);

const MessageSocket = () => {
  return (
    <div style={{ zIndex: 99 }}>
      <ComposeFirebase />
    </div>
  );
};

export default MessageSocket;
