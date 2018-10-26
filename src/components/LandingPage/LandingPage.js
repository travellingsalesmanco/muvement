import { Button, Col, Layout, Row } from 'antd';
import React from 'react';
import ReactGA from 'react-ga';
import GridImage from "../../img/grid-image-portrait.svg";
import Logo from "../../img/m-logo.svg";
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import SpotlightIcon from "../../icons/SpotlightIcon";
import SlideShareIcon from "../../icons/SlideShareIcon";
import Name from "../../img/MuvementLogo.png";
import FeatureTwo from "../../img/feature2.png";
import FeatureThree from "../../img/feature3.png";
import './LandingPage.css';
import { withRouter } from "react-router-dom";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class LandingPage extends React.Component {
  componentDidMount() {
    ReactGA.pageview('Landing Page');
  }

  render() {
    const { Header, Content, Sider } = Layout;
    return (
      <Layout style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
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
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
          <Content style={{ display: "flex", flexDirection: "column" }}>
            <img className="muvement-name-img" src={Name} alt="muvement name" />
            <p className="muvement-desc">Stage your moves</p>
            <Button className="landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
              CREATIVE</Button>
            <p className="muvement-features">Features</p>
            <p className="muvement-features-text">
                Stop using pen & paper, <br />  Create your formations here
                </p>
            <div className="demo-grid">
              <ResponsiveStageCanvas choreoId={"demo"} formationId={0}
                withGrid demo />
            </div>
            // <HeadphoneIcon style={{ fontSize: '20px' }}/>
            <p className="muvement-features-text">
                Sync transitions with your audio track
            </p>
            <img className="muvement-features-img" src={FeatureTwo} alt="muvement name" />

            <p className="muvement-features-text">
                Organise your performances <br /> anywhere and anytime!
            </p>
            <img className="muvement-features-img" src={FeatureThree} alt="muvement name" />
          </Content>
        </Layout>
      </Layout >
    );
  }
}

export default withRouter(LandingPage);
