import React from 'react';
import './Auth.css';
import { Button, Divider} from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route, withRouter } from "react-router-dom";
import LogInForm from "./LogInForm";
import * as auth from "../../firebase/auth";
import Link from "react-router-dom/es/Link";
import GoogleIcon from "../../img/google.svg";
import FacebookIcon from "../../img/facebook.svg";
import withAuthorization from "../withAuthorization";


class LogIn extends React.Component {

  render() {
    return (
      <div className="auth-background">
        <h1 className="auth-title">LOG IN</h1>
        <div className="auth-buttons">
          <Button className="fb-login-button"
                  onClick={() => auth.facebookSignIn().then(() => this.props.history.push(`/`))}>
                   <img src={FacebookIcon} className="social-login-icon"></img>
                  <span className="social-login-text">FACEBOOK</span>
          </Button>

          <Button className="google-login-button"
                  onClick={() => auth.googleSignIn().then(() => this.props.history.push(`/`))}>
                  <img src={GoogleIcon} className="social-login-icon"></img>
                  <span className="social-login-text">GOOGLE</span>
          </Button>
        </div>
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
