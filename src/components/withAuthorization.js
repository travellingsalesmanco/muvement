import React from 'react';
import { withRouter } from 'react-router-dom';
import { authInstance } from '../firebase';

const withAuthorization = (authCondition, failRoute) => (Component) => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isAuthorized: false,
        providers: []
      };
    }

    componentDidMount() {
      this.unsubscribe = authInstance.onAuthStateChanged(authUser => {
        if (authCondition(authUser)) {
          // Pass down additional authUser context to components
          if (authUser) {
            this.setState({ providers: authUser.providerData.map((provider) => provider.providerId) })
          }
          this.setState({ isAuthorized: true })
        } else {
          this.props.history.push(failRoute)
        }
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const { isAuthorized, providers } = this.state;
      return (
        isAuthorized ? <Component firebaseAuthProviders={providers} {...this.props} /> : null
      );
    }
  }

  return withRouter(WithAuthorization);
};

export default withAuthorization;