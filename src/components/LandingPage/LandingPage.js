import { Button, Col, Layout, Row } from 'antd';
import React, { Fragment }from 'react';
import ReactGA from 'react-ga';
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import SpotlightIcon from "../../icons/SpotlightIcon";
import SlideShareIcon from "../../icons/SlideShareIcon";
import Name from "../../img/MuvementLogo.png";
import FeatureTwo from "../../img/feature2.png";
import FeatureThree from "../../img/feature3.png";
import GridImageLandscape from "../../img/GridImageLandscape.svg";
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
      <Fragment>
        <MobilePortrait>
          <Layout style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <Header className="landingpage-navbar">
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
                <p className="muvement-desc">Create and visualise your formations <br /> without pen and paper</p>
                <Button className="landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
                  CREATIVE</Button>
                <p className="muvement-features">How it works</p>
                <SpotlightIcon style={{ fontSize: '35px'}}/>
                <p className="muvement-features-text">
                  Stage your formations, try it out below!
                </p>
                <div className="demo-grid">
                  <ResponsiveStageCanvas choreoId={"demo"} formationId={0}
                                         withGrid demo />
                </div>
                <HeadphoneIcon style={{ fontSize: '20px' , marginTop: '0.5em'}}/>
                <p className="muvement-features-text">
                  Sync transitions with your audio track
                </p>
                <img className="muvement-features-img" src={FeatureTwo} alt="muvement name" />

                <SlideShareIcon style={{ fontSize: '35px' , marginTop: '0.5em'}}/>
                <p className="muvement-features-text">
                  Organise your performances <br /> anywhere and anytime!
                </p>
                <img className="muvement-features-img" src={FeatureThree} alt="muvement name" />
              </Content>
            </Layout>
          </Layout>
        </MobilePortrait>

        <MobileLandscape>
          <Layout style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <Header className="landingpage-navbar">
              <div className="landing-login">
                <Button className="landing-login-button" onClick={() => this.props.history.push(`/login`)} ghost block>LOG
                  IN</Button>
              </div>
            </ Header>

            <Layout className="tablet-landingpage-contents">
              <GradientSVG
                startColor="#24c6dc"
                endColor="#514a9d"
                idCSS="cool-gradient"
              />
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Row>
                  <Col span={12}>
                    <div className="tablet-muvement-name">
                      <img className="ml-muvement-name-img" src={Name} alt="muvement name" />
                    </div>
                    <p className="ml-muvement-desc">Create and visualise your formations <br /> without pen and paper</p>
                    <div className="tablet-landing-signup">
                      <Button className="ml-landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
                        CREATIVE</Button>
                    </div>
                  </Col>
                  <Col span={12} className="demo-grid-outer">
                    <div className="ml-demo-grid">
                      <ResponsiveStageCanvas choreoId={"demo"} formationId={0}
                                             withGrid demo />
                    </div>
                  </Col>
                </Row>
                <p className="ml-muvement-features">More Features</p>

                <Row>
                  <Col span={12}>
                    <img className="ml-muvement-features-img" src={FeatureTwo} alt="muvement name" />
                  </Col>
                  <Col span={12}>
                    <div className="ml-muvement-features-icon">
                      <HeadphoneIcon style={{ fontSize: '20px' }}/>
                    </div>
                    <p className="ml-muvement-features-text">
                      Sync transitions with your audio track
                    </p>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                   <div className="ml-muvement-features-icon">
                    <SlideShareIcon style={{ fontSize: '35px'}}/>
                   </div>
                    <p className="ml-muvement-features-text">
                      Organise your performances <br /> anywhere and anytime!
                    </p>
                  </Col>

                  <Col span={12}>
                    <img className="ml-muvement-features-img" src={FeatureThree} alt="muvement name" />
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </MobileLandscape>

        <MinTablet>
          <Layout style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
            <Header className="landingpage-navbar">
              <div className="landing-login">
                <Button className="landing-login-button" onClick={() => this.props.history.push(`/login`)} ghost block>LOG
                  IN</Button>
              </div>
            </ Header>

            <Layout className="tablet-landingpage-contents">
              <GradientSVG
                startColor="#24c6dc"
                endColor="#514a9d"
                idCSS="cool-gradient"
              />
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Row type="flex" align="middle">
                  <Col span={12}>
                    <div className="tablet-muvement-name">
                      <img className="tablet-muvement-name-img" src={Name} alt="muvement name" />
                    </div>
                    <p className="tablet-muvement-desc">Create and visualise your formations <br /> without pen and paper</p>
                    <div className="tablet-landing-signup">
                      <Button className="tablet-landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
                        CREATIVE</Button>
                    </div>
                  </Col>
                  <Col span={12} className="tablet-demo-grid-outer">
                    <div className="tablet-demo-grid">
                      <ResponsiveStageCanvas choreoId={"demo"} formationId={0}
                                             withGrid demo />
                    </div>
                  </Col>
                </Row>
                <p className="tablet-muvement-features">More Features</p>

                <Row type="flex" align="middle">
                  <Col span={12}>
                    <img className="tablet-muvement-features-img" src={FeatureTwo} alt="muvement name" />
                  </Col>
                  <Col span={12}>
                    <div className="tablet-muvement-features-icon">
                      <HeadphoneIcon style={{ fontSize: '25px' }}/>
                    </div>
                    <p className="tablet-muvement-features-text">
                      Sync transitions with your audio track
                    </p>
                  </Col>
                </Row>

                <Row type="flex" align="middle">
                  <Col span={12}>
                  <div className="tablet-muvement-features-icon">
                   <SlideShareIcon style={{ fontSize: '35px'}}/>
                  </div>
                    <p className="tablet-muvement-features-text">
                      Organise your performances <br /> anywhere and anytime!
                    </p>
                  </Col>

                  <Col span={12}>
                    <img className="tablet-muvement-features-img" src={FeatureThree} alt="muvement name" />
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </MinTablet>
      </Fragment>
    );
  }
}

export default withRouter(LandingPage);
