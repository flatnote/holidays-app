import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import MenuAppBar from './MenuAppBar';
import { withFirebase } from '../Firebase';

class HeaderBar extends Component {
    render() {
        return ( <AuthUserContext.Consumer>
            {(authUser) =>
              authUser ? (
                <MenuAppBar {...this.props} auth authUser={authUser} />
              ) : (
                ""
              )
            }
          </AuthUserContext.Consumer>
        );
    }
}


export default withFirebase(HeaderBar);