import { Button, Col, Layout, Row } from 'antd';
import React from 'react';
import ReactGA from 'react-ga';
import GridImage from "../../img/grid-image-portrait.svg";
import Logo from "../../img/m-logo.svg";
import Name from "../../img/MuvementLogo.png";
import './LandingPage.css';
import { withRouter } from "react-router-dom";
import StageCanvas from "../StageCanvas/StageCanvas";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 300,
      stageHeight: 300,
    }
  }

  componentDidMount() {
    ReactGA.pageview('Landing Page');
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    if (this.state.stageWidth !== this.container.offsetWidth
      || this.state.stageHeight !== this.container.offsetHeight) {

      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };

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
            <img className="muvement-name-img" src={Name} alt="muvement name" />
            <p className="muvement-desc">Create and visualise your formation <br /> without pen and paper</p>
            <Button className="landing-signup-button" onClick={() => this.props.history.push(`/signup`)}>LETS GET
              CREATIVE</Button>
            <div
              className="demo-grid"
              style={{ flex: 1, overflow: "hidden" }}
              ref={node => {
                this.container = node;
              }}
            >
              <StageCanvas danceId={"demo"} frameId={0}
                           width={this.state.stageWidth}
                           height={this.state.stageHeight}
                           withGrid demo />
            </div>
            {/*<img className="grid-img" src={GridImage} alt="grid image" />*/}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(LandingPage);
