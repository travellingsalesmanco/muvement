import React from 'react';
import './LandingPage.css';
import {Button, Layout, Menu, Row, Col} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";
import Logo from  "../../img/m-logo.svg";
import Name from  "../../img/muvement-logo.svg";
import GridImage from  "../../img/grid-image.svg";

class LandingPage extends React.Component {
  render() {
      const {Header, Content, Sider} = Layout;
    return (
     <Layout className="landingpage-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <Header className="landingpage-navbar">
            <div className="logo">
                <img src={Logo} width="100" height="50" />
            </div>
            <div className="landing-login">
            <Button className="landing-login-button" ghost block>LOG IN</Button>
            </div>
        </ Header>
        <Layout className="landingpage-contents">
            <Content style={{display: "flex", flexDirection: "column"}}>
                <Row>
                    <Col className="muvement-name-img"span={12}>
                        <img src={Name} width="300" height="300" />
                        <p className="muvement-desc">Create and visualise your formation <br /> without pen and paper</p>
                        <Button className="landing-signup-button">LETS GET CREATIVE</Button>
                    </Col>
                    <Col span={12}>
                        <img className="grid-img"  src={GridImage}/>
                    </Col>
                </Row>
            </Content>
        </Layout>
    </Layout>
    );
  }
}

export default LandingPage;
