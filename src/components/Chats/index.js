import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import { withAuthorization } from "../Session";
import ChatHeader from "./ChatHeader";

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200]
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function MessageList(props) {
  const classes = useStyles();
  const { messages } = props;
  return (
    <div>
      {messages.map(item => {
        return (
          <Paper className={classes.paper} key={item.id}>
            {item.message}
          </Paper>
        );
      })}
    </div>
  );
}

function LayOut(props) {
  const classes = useStyles();
  const { messages } = props;

  return (
    <div className={classes.container}>
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChatHeader />
        </Grid>
        <Grid item xs={12}>
          <MessageList messages={messages} />
        </Grid>
      </Grid>
    </div>
  );
}

class index extends Component {
  state = { messages: [], message: "" };

  componentDidMount() {
    this.fetchMessages();
  }

  firestore = this.props.firebase.firestore;

  messageRef = this.firestore.collection("messages");

  async createMessage({ message, uid }) {
    console.log(this.messageRef);
    await this.messageRef.add({
      message,
      user_id: uid,
      created_at: new Date()
    });
  }

  async fetchMessages() {
    this.messageRef
      .orderBy("created_at", "desc")
      .limit(10)
      .onSnapshot(querySnapshot => {
        var messages = [];
        querySnapshot.forEach(function(doc) {
          messages.push({ id: doc.id, ...doc.data() });
        });
        this.setState({ messages });
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { authUser } = this.props;
    const { message } = this.state;
    this.createMessage({ message, uid: authUser.uid });
  };

  render() {
    const { messages } = this.state;
    const { authUser, theme } = this.props;
    return (
      <div>
        <LayOut
          {...this.props}
          messages={messages}
          createMessage={this.createMessage}
          authUser={authUser}
        />
        <div style={{ padding: theme.spacing(2) }}>
          <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <TextField
              fullWidth
              label="Message"
              onChange={e => {
                this.setState({ message: e.target.value });
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withTheme(withAuthorization(condition)(index));
