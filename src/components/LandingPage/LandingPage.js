import { Button, Col, Layout, Row } from 'antd';
import React from 'react';
import ReactGA from 'react-ga';
import GridImage from "../../img/grid-image-portrait.svg";
import Logo from "../../img/m-logo.svg";
import Name from "../../img/MuvementLogo.png";
import './LandingPage.css';
import { withRouter } from "react-router-dom";

class LandingPage extends React.Component {
  componentDidMount() {
    ReactGA.pageview('Landing Page');
  }

  render() {
    const { Header, Content, Sider } = Layout;
    return (
      <Layout className="landingpage-body" style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
        <Header className="landingpage-navbar">
          <div className="logo">
            <img src={Logo} width="100" height="50" alt="muvement logo" />
          </div>
          <div className="landing-login">
            <Button className="landing-login-button" onClick={() => this.props.history.push(`/login`)} ghost block>LOG
              IN</Button>
          </div>
        </ Header>

        <Layout className="landingpage-contents">
          <Content style={{ display: "flex", flexDirection: "column" }}>
            <img className="muvement-name-img" src={Name} width="250" height="180" alt="muvement name" />
            <p className="muvement-desc">Create and visualise your formation <br /> without pen and paper</p>
            <Button className="landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
              CREATIVE</Button>
            <img className="grid-img" src={GridImage} alt="grid image" />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(LandingPage);
