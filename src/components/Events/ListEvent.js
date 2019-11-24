import Fab from "@material-ui/core/Fab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import { withFirebase } from "../Firebase";

const buttonStyle = {
  margin: "10px 15px",
  maxWidth: "120px"
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: "relative",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

function FloatingActionButtonZoom() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const fabs = [
    {
      color: "primary",
      className: classes.fab,
      icon: <AddIcon />,
      label: "Add"
    },
    {
      color: "secondary",
      className: classes.fab,
      icon: <EditIcon />,
      label: "Edit"
    }
  ];

  return (
    <div className={classes.root}>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`
          }}
          unmountOnExit
        >
          <Fab
            aria-label={fab.label}
            className={fab.className}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </div>
  );
}

class ListEvent extends Component {
  state = {
    events: []
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { firebase } = this.props;

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

      events = events.map(event => {
        return {
          key: event.key,
          title: event.title,
          description: event.description,
          date: event.date
        };
      });
      this.setState({ events });
    });
  };

  render() {
    const { events } = this.state;
    return (
      <div>
        {events.length ? (
          events.map(event => (
            <div className="list-group" key={event.key}>
              <div className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{event.title}</h5>
                  <small>{event.date}</small>
                </div>

                <p className="mb-1">{event.description}</p>

                <div className="controls row">
                  <button
                    className="btn btn-outline-warning col"
                    data-toggle="modal"
                    data-target="#myModal"
                    type="button"
                    style={buttonStyle}
                    onClick={() => this.handleEdit(event.key)}
                  >
                    Edit Event
                  </button>

                  <button
                    className="btn btn-outline-danger col"
                    style={buttonStyle}
                    onClick={() => this.handleDelete(event.key)}
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events text-center" style={{ padding: "100px 0" }}>
            OOOPSY: NO EVENTS REGISTERED
          </div>
        )}

        <FloatingActionButtonZoom />
      </div>
    );
  }
}

export default withFirebase(ListEvent);
