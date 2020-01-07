import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import { loadCSS } from "fg-loadcss";
import React, { Component } from "react";
import { withAuthorization } from "../Session";
import "./chats.css";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function ChatBox(props) {
  const classes = useStyles();
  const { messages, authUser, firebase } = props;
  // set up firestore before use
  const { firestore } = firebase;
  const messageRef = firestore.collection("messages");

  React.useEffect(() => {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );
  }, []);

  const [state, setState] = React.useState({
    inputValue: ""
  });

  const createMessage = async ({ message, uid }) => {
    await messageRef.add({
      message,
      user_id: uid,
      created_at: new Date()
    });
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      submitMessage();
    }
  };

  const submitMessage = () => {
    const { inputValue } = state;
    if (inputValue) {
      createMessage({ message: inputValue, uid: authUser.uid });
      setState({ inputValue: "" });
    }
  };

  return (
    <div className={classes.container}>
      <CssBaseline />
      <div className="chat">
        <div className="contact bar">
          <h2>All Chats</h2>
        </div>
        <div className="messages" id="chat">
          <div className="time">
            {moment().format("dddd, Do MMMM YYYY, h:mm:ss a")}
          </div>
          {messages.map(item => {
            let messageClass = "message other";
            if (authUser.uid === item.user_id) {
              messageClass = "message me";
            }
            return (
              <div className={messageClass} key={item.id}>
                {item.message}
              </div>
            );
          })}
          <div className="message other">
            <div className="typing typing-1"></div>
            <div className="typing typing-2"></div>
            <div className="typing typing-3"></div>
          </div>
        </div>
        <div className="input">
          <i className="fas fa-camera"></i>
          <i className="far fa-laugh-beam"></i>
          <input
            placeholder="Type your message here!"
            type="text"
            onKeyPress={handleKeyPress}
            value={state.inputValue}
            onChange={event => setState({ inputValue: event.target.value })}
          />
          <i
            className="fas fa-chevron-right"
            onClick={() => submitMessage()}
          ></i>
        </div>
      </div>
    </div>
  );
}

class index extends Component {
  state = { messages: [] };

  messageRef = this.props.firebase.firestore.collection("messages");

  componentDidMount() {
    this.fetchMessages();
  }

  async fetchMessages() {
    await this.messageRef
      .orderBy("created_at", "asc")
      .onSnapshot(querySnapshot => {
        var messages = [];
        querySnapshot.forEach(function(doc) {
          messages.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ messages });
        let chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
      });
  }

  render() {
    const { messages } = this.state;
    const { authUser } = this.props;
    return (
      <ChatBox
        {...this.props}
        messages={messages}
        createMessage={this.createMessage}
        authUser={authUser}
      />
    );
  }
}

const condition = authUser => !!authUser;

export default withTheme(withAuthorization(condition)(index));
