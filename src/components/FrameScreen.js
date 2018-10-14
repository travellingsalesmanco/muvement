import {Breadcrumb, Button, Layout, Menu} from 'antd';
import React, {Component, Fragment} from 'react';
import './FrameScreen.css';
import BorderInnerIcon from "../icons/BorderInnerIcon";
import FileAddIcon from "../icons/FileAddIcon";
import GradientSVG from "../icons/GradientSVG";
import HeadphoneIcon from "../icons/HeadphoneIcon";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import RightArrowIcon from "../icons/RightArrowIcon";
import UserAddIcon from "../icons/UserAddIcon";
import Navigation from "./Navigation";
import SidePanel from "./SidePanel";
import StageCanvas from "./StageCanvas";
import {connect} from "react-redux";

class FrameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      stageWidth: 100,
      stageHeight: 100,
      sidePanelID: 0,
    }
  }

  componentDidMount() {
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
    if (this.state.stageWidth !== this.container.offsetWidth || this.state.stageHeight !== this.container.offsetHeight) {
      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };

  showDrawer = (item) => {
    console.log(item.key);
    if (item.key === "1" || item.key === "4") {
      this.setState({
        visible: true,
        sidePanelID: parseInt(item.key),
      });
    }
  };
  onClose = () => {
    this.setState({
      visible: false,
      sidePanelID: 0
    });
  };

  render() {
    const {Content, Sider} = Layout;
    return (
      <Fragment>
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
        <Layout className="body">
          <Navigation title={this.props.danceName}/>
          <Layout className="contents">
            <Content style={{display: "flex", flexDirection: "column"}}>
              <div className="section-title-container">
                <div className="section-title">
                  <h3>{this.props.frameName} ({this.props.frameNumSeconds} seconds)</h3>
                </div>
              </div>
              <div
                style={{background: '#000', flex: 1}}
                ref={node => {
                  this.container = node;
                }}
              >
                <StageCanvas width={this.state.stageWidth} height={this.state.stageHeight}/>
              </div>
              <Breadcrumb separator=">" className="breadcrumb">
                <Breadcrumb.Item>{this.props.danceName}</Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.frameName} ({this.props.frameNumSeconds} seconds)</Breadcrumb.Item>
              </Breadcrumb>
            </Content>
            <Sider width={200} className="sider">
              <Menu
                mode="inline"
                className="sider-menu"
                theme="dark"
                onClick={this.showDrawer}
              >
                <Menu.Item key="1">
                  <Button className="sider-button" shape="circle">
                    <UserAddIcon/>
                  </Button>
                  <p>Performers</p>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button className="sider-button" shape="circle">
                    <FileAddIcon/>
                  </Button>
                  <p>Add Formation</p>
                </Menu.Item>
                <Menu.Item key="3">
                  <Button className="sider-button" shape="circle">
                    <HeadphoneIcon/>
                  </Button>
                  <p>Add Music</p>
                </Menu.Item>
                <Menu.Item key="4">
                  <Button className="sider-button" shape="circle">
                    <BorderInnerIcon/>
                  </Button>
                  <p>Stage Dimension</p>
                </Menu.Item>
                <Menu.Item key="5">
                  <Button className="sider-button" shape="circle">
                    <LeftArrowIcon/>
                  </Button>
                  <p>Previous</p>
                </Menu.Item>
                <Menu.Item key="6">
                  <Button className="sider-button" shape="circle">
                    <RightArrowIcon/>
                  </Button>
                  <p>Next</p>
                </Menu.Item>
              </Menu>
            </Sider>
            <SidePanel
              placement={this.state.placement}
              closable={true}
              onClose={this.onClose}
              visible={this.state.visible}
              mask={false}
              id={this.state.sidePanelID}
              width={200}
            />
          </Layout>
        </Layout>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const activeDance = state.dances[state.UI.activeDance];
  const activeFrame = activeDance.frames[state.UI.activeFrame];
  return {
    danceId: state.UI.activeDance,
    frameId: state.UI.activeFrame,
    danceName: activeDance.name,
    frameName: activeFrame.name,
    frameNumSeconds: activeFrame.numSeconds
  }
}

export default connect(mapStateToProps)(FrameScreen);
