import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Launcher } from "react-chat-window";

const socketEndpoint = process.env.SOCKET_ENDPOINT || "http://localhost:9000";

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
      endpoint: socketEndpoint
    };
    this._onMessageWasSent = this._onMessageWasSent.bind(this);
  }

  componentDidMount = () => {
    console.log(process.env);
    this.socketResponse();
  };

  // รอรับข้อมูลเมื่อ server มีการ update
  socketResponse = () => {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("new-message", messageNew => {
      this.setState({ messageList: messageNew });
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
    const { messageList } = this.state;
    return (
      <div>
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

const MessageSocket = () => {
  return (
    <div style={{ zIndex: 99 }}>
      <Demo />
    </div>
  );
};

export default MessageSocket;
