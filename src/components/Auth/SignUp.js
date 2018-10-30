import React from 'react';
import './Auth.css';
import { Button, Divider } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route } from "react-router-dom";
import GoogleIcon from "../../img/google.svg";
import FacebookIcon from "../../img/facebook.svg";
import { auth, firebaseConstants } from "../../firebase";
import SignUpForm from "./SignUpForm";
import Link from "react-router-dom/es/Link";
import withAuthorization from "../withAuthorization";

const FACEBOOK_PROVIDER_MESSAGE = "You are registered through Facebook. Please sign in through that instead.";
const GOOGLE_PROVIDER_MESSAGE = "You are registered through Google. Please sign in through that instead.";
const EMAIL_PROVIDER_MESSAGE = "You are registered through email and password. Please sign in through that instead.";


class SignUp extends React.Component {
  state = {
    disabled: false,
    errMessage: ""
  };

  handleFacebookSignUp = () => {
    this.setState({
        disabled: true,
      }, () => auth.facebookSignIn()
        .then(() => this.props.history.push(`/`))
        .catch((err) => {
          let errMessage = "Could not sign up";
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

  handleGoogleSignUp = () => {
    this.setState({
        disabled: true,
      }, () => auth.googleSignIn()
        .then(() => this.props.history.push(`/`))
        .catch((err) => {
          let errMessage = "Could not sign up";
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
        <h1 className="auth-title">SIGN UP</h1>
        <p className="auth-text">Continue With</p>
        <div className="auth-buttons">
          <Button className="fb-login-button"
                  onClick={this.handleFacebookSignUp}
                  disabled={this.state.disabled}>
            <img src={FacebookIcon} className="social-login-icon"></img>
            <span className="social-login-text">FACEBOOK</span>
          </Button>
          <Button className="google-login-button"
                  onClick={this.handleGoogleSignUp}
                  disabled={this.state.disabled}>
            <img src={GoogleIcon} className="social-login-icon"></img>
            <span className="social-login-text">GOOGLE</span>
          </Button>
        </div>
        <p className="auth-error-text">{this.state.errMessage}</p>
        <div>
          <Divider className="auth-divider"><span className="divider-text">Or Create Your Own Account</span></Divider>
        </div>
        <div className="auth-form">
          <SignUpForm />
        </div>
        <p className="auth-text">Have an account? <Link className="form-link" to={`/login`}>Log in</Link></p>
      </div>
    );
  }
}

// Auth does not exist
const authCondition = (authUser) => !authUser;
const failRoute = "/";

export default withAuthorization(authCondition, failRoute)(SignUp);
