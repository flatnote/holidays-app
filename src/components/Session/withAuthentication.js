import React from "react";
import { withFirebase } from "../Firebase";
import AuthUserContext from "./context";
import CircularIndeterminate from "../CircularIndeterminate";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        loading: true
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          this.setState({ authUser, loading: false });
        },
        () => {
          this.setState({ authUser: null, loading: false });
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    isLoading = () => {
      if (this.state.loading) {
        return <LoadingScreen />;
      } else {
        return (
          <AuthUserContext.Provider value={this.state.authUser}>
            <Component {...this.props} />
          </AuthUserContext.Provider>
        );
      }
    };

    render() {
      return <div>{this.isLoading()}</div>;
    }
  }

  return withFirebase(WithAuthentication);
};

const LoadingScreen = ({ type, color }) => {
  return (
    <div className="loading-center" style={{ margin: "-50px 0 0 -25px" }}>
      <CircularIndeterminate />
    </div>
  );
};

export default withAuthentication;
