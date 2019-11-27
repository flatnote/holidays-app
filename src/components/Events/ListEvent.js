import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { Component } from "react";
import loadingImg from "../../svg/Interwind-1s-200px.svg";
import { withFirebase } from "../Firebase";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    position: "relative"
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  card: {},
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

function EventCard(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { cardData } = props;
  const { imgData } = cardData;
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="settings" onClick={handleMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Edit</MenuItem>
              <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>
          </div>
        }
        title={
          <Typography gutterBottom variant="h5" component="h2">
            {cardData.title}
          </Typography>
        }
        subheader="September 14, 2016"
      />
      <CardMedia
        className={classes.media}
        image={imgData.download_url}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Description
        </Typography>
      </CardContent>
    </Card>
  );
}

class ListEvent extends Component {
  render() {
    const { events, loading, noevent } = this.props;
    return (
      <div>
        {events.length !== 0 &&
          events.map(event => (
            <div className="list-group" key={event.key}>
              <EventCard cardData={event} />
            </div>
          ))}
        {noevent && <div className="center">OOOPSY: NO EVENTS REGISTERED</div>}
        {loading && (
          <div className="center">
            <img
              src={loadingImg}
              style={{
                margin: "-100px 0 0 -100px"
              }}
              alt="loading"
            />
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(ListEvent);
