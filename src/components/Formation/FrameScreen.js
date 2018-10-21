import { Breadcrumb, Button, Input, Layout, Menu } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { addAndSetActiveFrame, gotoFrame } from "../../actions/danceActions";
import { renameFrame } from "../../actions/frameActions";
import BorderInnerIcon from "../../icons/BorderInnerIcon";
import FileAddIcon from "../../icons/FileAddIcon";
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import LeftArrowIcon from "../../icons/LeftArrowIcon";
import RightArrowIcon from "../../icons/RightArrowIcon";
import UserAddIcon from "../../icons/UserAddIcon";
import StageCanvas from "../StageCanvas/StageCanvas";
import './FrameScreen.css';
import Navigation from "./Navigation";
import PreviewSlideList from "./PreviewSlideList";
import SidePanel from "./SidePanel";
import { getDance } from '../../selectors/dance';
import withAuthorization from "../withAuthorization";

class FrameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      stageWidth: 100,
      stageHeight: 100,
      sidePanelID: 0,
      frameName: '',
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
    if (this.state.stageWidth !== this.container.offsetWidth
      || this.state.stageHeight !== this.container.offsetHeight) {

      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };

  handleMenuClick = (item) => {
    console.log(item.key);
    if (item.key === "1" || item.key === "4") {
      this.setState({
        visible: true,
        sidePanelID: parseInt(item.key),
      });
    } else if (item.key === "2") {
      this.props.dispatch(addAndSetActiveFrame(this.props.danceId, this.props.frameId + 1));
    } else if (item.key === "5") {
      this.props.dispatch(gotoFrame(this.props.danceId, this.props.frameId - 1));
    } else if (item.key === "6") {
      this.props.dispatch(gotoFrame(this.props.danceId, this.props.frameId + 1));
    }
  };

  handleEditPerformer = () => {
    this.setState({
      visible: true,
      sidePanelID: 1,
    });
  };

  handleAddFormation = () => {
    this.props.dispatch(addAndSetActiveFrame(this.props.danceId, this.props.frameId + 1));
  };

  handleEditTimeline = () => {

  };

  onClose = () => {
    this.setState({
      visible: false,
      sidePanelID: 0
    });
  };

  handleEditName = e => {
    this.setState({
      frameName: e.target.value,
    }, () => {
      this.props.dispatch(renameFrame(this.props.danceId, this.props.frameId, this.state.frameName));
    });
  };

  handleEditNameConfirm = e => {
    e.target.blur();
  };

  render() {
    const { Content, Sider } = Layout;
    return (
      <Fragment>
        <Layout className="body">
          <GradientSVG
            startColor="#24c6dc"
            endColor="#514a9d"
            idCSS="cool-gradient"
          />
          <Navigation title={this.props.danceName} history={this.props.history} danceId={this.props.danceId} />
          <Layout className="contents">
            <Content style={{ display: "flex", flexDirection: "column" }}>
              <div className="section-title-container">
                <div className="section-title">
                  <div className="section-title-inner">
                    <Input
                      placeholder="Enter formation name"
                      value={this.props.frameName}
                      onChange={this.handleEditName}
                      onPressEnter={this.handleEditNameConfirm}
                    />
                  </div>
                </div>
              </div>
              <div
                className="framescreen-stage"
                style={{ background: '#000', flex: 1, overflow: "hidden"}}
                ref={node => {
                  this.container = node;
                }}
              >
                <StageCanvas danceId={this.props.danceId} frameId={this.props.frameId} width={this.state.stageWidth}
                  height={this.state.stageHeight} editable withGrid />
              </div>
            </Content>
            <Sider width={200} className="sider">
              <div className="button-container">
                <Button className="sider-button" shape="circle" onClick={this.handleEditPerformer}>
                  <UserAddIcon style={{ fontSize: '33px'}}/>
                </Button>
                <Button className="sider-button" shape="circle" onClick={this.handleAddFormation}>
                  <FileAddIcon style={{ fontSize: '25px'}} />
                </Button>
                <Button className="sider-button" shape="circle" onClick={this.handleEditTimeline}>
                  <HeadphoneIcon style={{ fontSize: '25px'}}/>
                </Button>
              </div>
              <PreviewSlideList danceId={this.props.danceId}/>
            </Sider>
            <SidePanel
              danceId={this.props.danceId}
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

function mapStateToProps(state, props) {
  const danceId = props.match.params.choreoId;
  const dance = getDance(state, danceId)
  const activeFrame = dance.frames[state.UI.activeFrame];
  return {
    danceId: danceId,
    frameId: state.UI.activeFrame,
    danceName: dance.name,
    frameName: activeFrame.name,
    frameNumSeconds: activeFrame.numSeconds
  }
}

// Auth exists
// TODO: Check if authorized to edit dance
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(connect(mapStateToProps)(FrameScreen));
