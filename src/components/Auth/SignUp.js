import React from 'react';
import './Auth.css';
import {Button, Layout, Menu, Row, Col} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";
import GridImage from  "../../img/grid-image.svg";

class SignUp extends React.Component {

  render() {
    return (
     <div className="auth-background">
        <h1 className="auth-title">SIGN UP</h1>
        <p className="auth-text">Continue With</p>
        <div className="auth-buttons">
            <Button className="fb-login-button">FACEBOOK</Button>
            <Button className="google-login-button">GOOGLE</Button>
        </div>
        <Row>
            <Col span={8} className="divider"></Col>
            <Col span={8}>
                <p className="auth-text">Or Create Your Own Account</p>
            </Col>
            <Col span={8} className="divider"></Col>
        </Row>
        <div className="auth-signup">
            <Button className="auth-signup-button" type="primary" htmlType="submit">SIGN UP</Button>
        </div>
        <p className="auth-text">Have an account? Log in </p>
     </div>

    );
  }
}

export default SignUp;
