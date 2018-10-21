import React from 'react';
import { withRouter } from 'react-router-dom';
import { firebase } from '../firebase';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push('/landing');
        }
        // also ensure user is signed in
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    render() {
      const { authUser } = this.state;
      return (
          authUser ? <Component {...this.props} /> : null
      );
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;