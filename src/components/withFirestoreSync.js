import React from 'react';
import { firestore } from '../firebase';

const withFireStoreSync = (withDanceRouteParams) => (Component) => {
  class CheckAccessAndUpdate extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        error: null
      };
    }

    componentDidMount() {
      if (withDanceRouteParams) {
        const danceId = this.props.match.params.choreoId;
        console.log(danceId);
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        return firestore.getDance(danceId).then(() => {
          // Dispatch possible update to redux and return component
          this.setState({ loading: false, error: null });
        }).catch((error) => {
          console.log(error);
          // Possibly drop local dance if unauth
          this.setState({ loading: false, error: error });
        })
      } else {
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        return firestore.getCreatorDances().then(() => {
          // Dispatch possible update(s) to redux and return component
          this.setState({ loading: false, error: null });
        }).catch((error) => {
          console.log(error);
          // Possibly drop local dance if unauth
          this.setState({ loading: false, error: error });
        })
      }
    }

    render() {
      const { loading, error } = this.state;
      if (!loading) {
        if (error != null) {
          // TODO: replace with unauthorized / 404 page
          return null;
        } else {
          return <Component {...this.props} />
        }
      } else {
        // TODO: replace with loading
        return null;
      }
    }
  }

  return CheckAccessAndUpdate;
};

export default withFireStoreSync;