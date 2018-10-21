import React from 'react';
import './Auth.css';
import { Button, Layout } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";

class ForgotPassword extends React.Component {

  render() {
    const { Header } = Layout;
    return (
      <Layout>
        <Header className="auth-header">
          <div>
            <Button className="auth-backbutton" style={{ fontSize: '25px' }} icon="left"
                    onClick={() => this.props.history.push('/')} />
          </div>
        </Header>
        <div className="auth-background">
          <h1 className="auth-title">FORGOT YOUR PASSWORD?</h1>
          <p className="auth-text">We got you! Please enter the email you registered with us.</p>
          <div className="auth-form">
            <ForgotPasswordForm />
          </div>
        </div>
      </Layout>


    );
  }
}

export default ForgotPassword;
