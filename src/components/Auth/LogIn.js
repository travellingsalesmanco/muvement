import React from 'react';
import './Auth.css';
import {Button, Layout, Menu, Row, Col} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";
import GridImage from  "../../img/grid-image.svg";

class LogIn extends React.Component {

  render() {
    return (
     <div className="auth-background">
        <h1 className="auth-title">LOG IN</h1>
        <div className="auth-buttons">
            <Button className="fb-login-button">FACEBOOK</Button>
            <Button className="google-login-button">GOOGLE</Button>
        </div>
        <Row>
            <Col span={8} className="divider"></Col>
            <Col span={8}>
                <p className="auth-text">Or Log In With </p>
            </Col>
            <Col span={8} className="divider"></Col>
        </Row>
        <div className="auth-signup">
            <Button className="auth-signup-button" type="primary" htmlType="submit">SIGN UP</Button>
        </div>
        <p className="auth-text">Do not have an account? Sign Up </p>
     </div>

    );
  }
}

export default LogIn;
