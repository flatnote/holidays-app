import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import axios from "axios";

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

function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { cardData } = props;
  const { imgData } = cardData;
  console.log(imgData.url);
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
        image={imgData.url}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Description
        </Typography>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions> */}
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Description:</Typography>
        </CardContent>
      </Collapse> */}
    </Card>
  );
}

class ListEvent extends Component {
  state = {
    events: []
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { firebase } = this.props;

    const randomImgs = (
      await axios.get("https://picsum.photos/v2/list?page=2&limit=100")
    ).data;

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
    const { events } = this.state;
    return (
      <div>
        {events.length ? (
          events.map(event => (
            <div className="list-group" key={event.key}>
              <RecipeReviewCard cardData={event} />
            </div>
          ))
        ) : (
          <div className="no-events text-center" style={{ padding: "100px 0" }}>
            OOOPSY: NO EVENTS REGISTERED
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(ListEvent);
