import React from 'react';
import { withRouter } from 'react-router-dom';
import { firebase } from '../firebase';

const withAuthorization = (authCondition, failRoute) => (Component) => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isAuthorized: false,
      };
    }

    componentDidMount() {
      this.unsubscribe = firebase.auth.onAuthStateChanged(authUser => {
        if (authCondition(authUser)) {
          this.setState({isAuthorized: true})
        } else {
          this.props.history.push(failRoute)
        }
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const { isAuthorized } = this.state;
      return (
        isAuthorized ? <Component {...this.props} /> : null
      );
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;