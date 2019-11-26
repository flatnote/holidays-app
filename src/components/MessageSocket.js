import React, { Component } from "react";
import { Launcher } from "react-chat-window";
import socketIOClient from "socket.io-client";
import { withFirebase } from "./Firebase";
import { AuthUserContext } from "./Session";

const socketEndpoint = "https://socket-holidays-chat.herokuapp.com";

class MessageSocket extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      endpoint: socketEndpoint,
      messages: []
    };
    this._onMessageWasSent = this._onMessageWasSent.bind(this);
  }

  componentDidMount = () => {
    // const { firebase } = this.props;

    // const messagesRef = firebase
    //   .chatMessage()
    //   .orderByKey()
    //   .limitToLast(100);

    // messagesRef.on("value", snapshot => {
    //   let messagesObj = snapshot.val();
    //   let messages = [];
    //   Object.keys(messagesObj).forEach(key => messages.push(messagesObj[key]));
    //   messages = messages.map(message => {
    //     // console.log(message);
    //     return { text: message.text, user: message.user, id: message.key };
    //   });
    //   this.setState({ messages: messages });
    // });
    this.socketResponse();
  };

  // รอรับข้อมูลเมื่อ server มีการ update
  socketResponse = () => {
    const { authUser } = this.props;
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("new-message", messageList => {
      this.setState({
        messageList: messageList.map(item => {
          return {
            ...item,
            author: item.author === authUser.email ? "me" : "them"
          };
        })
      });
    });
  };

  _onMessageWasSent(message) {
    const { authUser } = this.props;
    const { endpoint } = this.state;
    message.author = authUser.email;
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
      <div style={{ zIndex: 100 }}>
        <Launcher
          agentProfile={{
            teamName: "Holidays-Chat",
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

const condition = authUser => !!authUser;

class ProvideAuthUser extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          condition(authUser) ? (
            <MessageSocket {...this.props} authUser={authUser} />
          ) : (
            ""
          )
        }
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(ProvideAuthUser);
