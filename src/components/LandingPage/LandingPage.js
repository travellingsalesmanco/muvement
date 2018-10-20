import {Button, Col, Layout, Row} from 'antd';
import React from 'react';
import ReactGA from 'react-ga';
import GridImage from "../../img/grid-image.svg";
import Logo from "../../img/m-logo.svg";
import Name from "../../img/MuvementLogo.png";
import './LandingPage.css';

class LandingPage extends React.Component {
  componentDidMount() {
    ReactGA.pageview('Landing Page');
  }

  render() {
    const {Header, Content, Sider} = Layout;
    return (
      <Layout className="landingpage-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <Header className="landingpage-navbar">
          <div className="logo">
            <img src={Logo} width="100" height="50" alt="muvement logo"/>
          </div>
          <div className="landing-login">
            <Button className="landing-login-button" ghost block>LOG IN</Button>
          </div>
        </ Header>
        <Layout className="landingpage-contents">
          <Content style={{display: "flex", flexDirection: "column"}}>
            <Row>
              <Col className="muvement-name-img" span={12}>
                <img src={Name} width="250" height="180" alt="muvement name"/>
                <p className="muvement-desc">Create and visualise your formation <br/> without pen and paper</p>
                <Button className="landing-signup-button">LETS GET CREATIVE</Button>
              </Col>
              <Col span={12}>
                <img className="grid-img" src={GridImage} alt="grid image"/>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default LandingPage;
