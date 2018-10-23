import React from 'react';
import './Auth.css';
import { Button, Divider } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route } from "react-router-dom";
import GoogleIcon from "../../img/google.svg";
import FacebookIcon from "../../img/facebook.svg";
import { auth } from "../../firebase";
import SignUpForm from "./SignUpForm";
import Link from "react-router-dom/es/Link";

class SignUp extends React.Component {

  render() {
    return (
      <div className="auth-background">
        <h1 className="auth-title">SIGN UP</h1>
        <p className="auth-text">Continue With</p>
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

export default SignUp;
