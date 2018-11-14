import React from 'react';
import { firestore } from '../firebase';
import { clearTrialChoreo, syncCreatorChoreo, syncCreatorChoreos, updateChoreoIfNewer } from "../actions/choreoActions";
import { connect } from "react-redux/";
import NotFound from "./Static/NotFound";

const withFireStoreSync = (withChoreoRouteParams, mustOwn) => (Component) => {
  class CheckAccessAndUpdate extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        error: null,
        manualOverwrite: false,
        affectedChoreos: []
      };
    }

    componentDidMount() {
      if (withChoreoRouteParams) {
        const choreoId = this.props.match.params.choreoId;
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        // Strictly requires ownership
        if (mustOwn) {
          return firestore.getChoreoIfOwned(choreoId).then((choreo) => {
            // Dispatch possible update to redux and return component (prevents overwrites)
            this.props.dispatch(syncCreatorChoreo(choreoId, choreo)).then((res) => {
                this.setState({
                  loading: false,
                  error: null,
                  manualOverwrite: res.requiresManualOverwrite,
                  affectedChoreos: [res.affectedChoreo]
                })
              }
            )
          }).catch((error) => {
            console.log(error);
            // TODO: Possibly drop local choreo if unauth
            this.setState({ loading: false, error: error });
          })
        } else {
          return firestore.getChoreo(choreoId).then((choreo) => {
            // Dispatch possible update to redux and return component (prevents overwrites)
            this.props.dispatch(updateChoreoIfNewer(choreoId, choreo)).then(() =>
              this.setState({ loading: false, error: null })
            )
          }).catch((error) => {
            console.log(error);
            // TODO: Possibly drop local choreo if unauth
            this.setState({ loading: false, error: error });
          })
        }
      } else {
        // Currently a one-time read, can switch to firestore listener in future for collaborative editing
        return firestore.getCreatorChoreos().then((choreos) => {
          // Dispatch possible update(s) to redux and return component
          this.props.dispatch(syncCreatorChoreos(choreos)).then((res) => {
              this.setState({
                loading: false,
                error: null,
                manualOverwrite: res.requiresManualOverwrite,
                affectedChoreos: res.affectedChoreos
              })
            }
          )
        }).catch((error) => {
          console.log(error);
          // Possibly drop local choreo if unauth
          this.setState({ loading: false, error: error });
        })
      }
    }

    render() {
      const { loading, error, manualOverwrite, affectedChoreos } = this.state;
      if (error != null) {
        return <NotFound />;
      } else {
        return <Component loading={loading}
                          manualOverwrite={manualOverwrite}
                          affectedChoreos={affectedChoreos}
                          {...this.props} />
      }
    }
  }

  return connect()(CheckAccessAndUpdate);
};

export default withFireStoreSync;