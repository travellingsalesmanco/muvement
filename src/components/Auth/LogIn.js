import React from 'react';
import './Auth.css';
import { Button, Divider } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route, withRouter } from "react-router-dom";
import LogInForm from "./LogInForm";
import Link from "react-router-dom/es/Link";
import GoogleIcon from "../../img/google.svg";
import FacebookIcon from "../../img/facebook.svg";
import withAuthorization from "../withAuthorization";
import { auth, firebaseConstants } from "../../firebase"

const FACEBOOK_PROVIDER_MESSAGE = "You are registered through Facebook. Please sign in through that instead.";
const GOOGLE_PROVIDER_MESSAGE = "You are registered through Google. Please sign in through that instead.";
const EMAIL_PROVIDER_MESSAGE = "You are registered through email and password. Please sign in through that instead.";


class LogIn extends React.Component {
  state = {
    disabled: false,
    errMessage: ""
  };

  handleFacebookLogin = () => {
    this.setState({
        disabled: true,
      }, () => auth.facebookSignIn()
        .then(() => this.props.history.push(`/`))
        .catch((err) => {
          let errMessage = "Could not log in";
          if (err.code === firebaseConstants.PROVIDER.ACCOUNT_EXISTS_CODE) {
            if (err.method === firebaseConstants.EMAIL_SIGN_IN_METHOD) {
              errMessage = EMAIL_PROVIDER_MESSAGE;
            } else if (err.method === firebaseConstants.GOOGLE_SIGN_IN_METHOD) {
              errMessage = GOOGLE_PROVIDER_MESSAGE;
            }
          }
          this.setState({
            disabled: false,
            errMessage: errMessage
          });
        })
    )
  };

  handleGoogleLogin = () => {
    this.setState({
        disabled: true,
      }, () => auth.googleSignIn()
        .then(() => this.props.history.push(`/`))
        .catch((err) => {
          let errMessage = "Could not log in";
          if (err.code === firebaseConstants.PROVIDER.ACCOUNT_EXISTS_CODE) {
            if (err.method === firebaseConstants.EMAIL_SIGN_IN_METHOD) {
              errMessage = EMAIL_PROVIDER_MESSAGE;
            } else if (err.method === firebaseConstants.FACEBOOK_SIGN_IN_METHOD) {
              errMessage = FACEBOOK_PROVIDER_MESSAGE;
            }
          }
          this.setState({
            disabled: false,
            errMessage: errMessage
          });
        })
    )
  };

  render() {
    return (
      <div className="auth-background">
        <h1 className="auth-title">LOG IN</h1>
        <div className="auth-buttons">
          <Button className="fb-login-button"
                  onClick={this.handleFacebookLogin}
                  disabled={this.state.disabled}>
            <img src={FacebookIcon} className="social-login-icon"></img>
            <span className="social-login-text">FACEBOOK</span>
          </Button>

          <Button className="google-login-button"
                  onClick={this.handleGoogleLogin}
                  disabled={this.state.disabled}>
            <img src={GoogleIcon} className="social-login-icon"></img>
            <span className="social-login-text">GOOGLE</span>
          </Button>
        </div>
        <p className="auth-error-text">{this.state.errMessage}</p>
        <div>
          <Divider className="auth-divider"><span className="divider-text">Or Log In With</span></Divider>
        </div>
        <div className="auth-form">
          <LogInForm />
        </div>
        <p className="auth-text">Your first time here? <Link className="form-link" to={`/signup`}>Get Started</Link></p>
      </div>

    );
  }
}

// Auth does not exist
const authCondition = (authUser) => !authUser;
const failRoute = "/";

export default withAuthorization(authCondition, failRoute)(withRouter(LogIn));
