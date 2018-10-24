import React from 'react';
import { firestore } from '../firebase';
import { syncCreatorChoreos, updateChoreoIfNewer } from "../actions/choreoActions";
import { connect } from "react-redux/";

const withFireStoreSync = (withChoreoRouteParams) => (Component) => {
  class CheckAccessAndUpdate extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        error: null
      };
    }

    componentDidMount() {
      if (withChoreoRouteParams) {
        const choreoId = this.props.match.params.choreoId;
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        return firestore.getChoreo(choreoId).then((choreo) => {
          // Dispatch possible update to redux and return component
          this.props.dispatch(updateChoreoIfNewer(choreoId, choreo));
          this.setState({ loading: false, error: null });
        }).catch((error) => {
          console.log(error);
          // TODO: Possibly drop local choreo if unauth
          this.setState({ loading: false, error: error });
        })
      } else {
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        return firestore.getCreatorChoreos().then((choreos) => {
          // Dispatch possible update(s) to redux and return component
          this.props.dispatch(syncCreatorChoreos(choreos));
          this.setState({ loading: false, error: null });
        }).catch((error) => {
          console.log(error);
          // Possibly drop local choreo if unauth
          this.setState({ loading: false, error: error });
        })
      }
    }

    render() {
      const { loading, error } = this.state;
      if (error != null) {
        // TODO: replace with unauthorized / 404 page
        return null;
      } else {
        return <Component loading={loading} {...this.props}  />
      }
    }
  }

  return connect()(CheckAccessAndUpdate);
};

export default withFireStoreSync;