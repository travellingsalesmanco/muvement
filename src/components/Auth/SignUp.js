import { Button, Divider } from 'antd';
import React from 'react';
import { auth, firebaseConstants } from "../../firebase";
import FacebookIcon from "../../img/facebook.svg";
import GoogleIcon from "../../img/google.svg";
import withAuthorization from "../withAuthorization";
import './Auth.css';
import SignUpForm from "./SignUpForm";
import { withRouter, Link } from 'react-router-dom';

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
        .then(() => {
          if (this.props.trialHandler) {
            this.props.trialHandler().then(() => this.props.history.push(`/dashboard`));
          } else {
            this.props.history.push(`/dashboard`)
          }
        })
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
        .then(() => {
          if (this.props.trialHandler) {
            this.props.trialHandler().then(() => this.props.history.push(`/dashboard`));
          } else {
            this.props.history.push(`/dashboard`)
          }
        })
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
    const { trialHandler } = this.props;
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
          <SignUpForm trialHandler={trialHandler} />
        </div>
        {
          this.props.switchHandler
            ? <p className="auth-text">
              Have an account? <span className="form-link" style={{ textDecoration: 'underline' }}
                                     onClick={this.props.switchHandler}>Log in</span>
            </p>
            :
            <p className="auth-text">
              Have an account? <Link className="form-link" to={`/login`}>Log in</Link>
            </p>
        }
      </div>
    );
  }
}

// Auth does not exist
const authCondition = (authUser) => !authUser;
const failRoute = "/dashboard";

export default withAuthorization(authCondition, failRoute)(SignUp);

const SignUpScreen = withRouter(SignUp);

export { SignUpScreen };
