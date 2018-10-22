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
      this.unsubscribe = firebase.auth.onAuthStateChanged(authUser => {
        // Ensure user is signed in
        authUser
          ? this.setState({ authUser }, () => {
            if (!authCondition(authUser)) {
              this.props.history.push('/landing');
            }
          })
          : this.setState({ authUser: null }, () => {
            if (!authCondition(authUser)) {
              this.props.history.push('/landing');
            }
          });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
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