import React from 'react';
import './Auth.css';
import { Button, Divider } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route } from "react-router-dom";
import LogInForm from "./LogInForm";


class LogIn extends React.Component {

  render() {
    return (
      <div className="auth-background">
        <h1 className="auth-title">LOG IN</h1>
        <div className="auth-buttons">
          <Button className="fb-login-button">FACEBOOK</Button>
          <Button className="google-login-button">GOOGLE</Button>
        </div>
        <div>
          <Divider className="auth-divider"><span className="divider-text">Or Log In With</span></Divider>
        </div>
        <div className="auth-form">
          <LogInForm />
        </div>
        <p className="auth-text">Your first time here? <a className="form-link" href="">Get Started</a></p>
      </div>

    );
  }
}

export default LogIn;
