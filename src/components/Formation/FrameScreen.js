import { Button, Input, Layout } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { addAndSetActiveFrame, gotoFrame } from "../../actions/danceActions";
import { renameFrame } from "../../actions/frameActions";
import FileAddIcon from "../../icons/FileAddIcon";
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import UserAddIcon from "../../icons/UserAddIcon";
import { getDance } from '../../selectors/dance';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import withAuthorization from "../withAuthorization";
import withFireStoreSync from "../withFirestoreSync";
import './FrameScreen.css';
import Navigation from "./Navigation";
import PreviewSlideList from "./PreviewSlideList";
import SidePanel from "./SidePanel";
import Timeline from "./Timeline";

const SectionTitle = ({ mobile, frameName, handleEditName, handleEditNameConfirm }) => (
  <div className="section-title-container">
    <div className="section-title" style={{ margin: mobile ? '1rem 2rem' : '2rem' }}>
      <div className="section-title-inner">
        <Input
          placeholder="Enter formation name"
          value={frameName}
          onChange={handleEditName}
          onPressEnter={handleEditNameConfirm}
        />
      </div>
    </div>
  </div>
);

const MobileSwitchTabs = ({ activeButton, handleClick }) => (
  <div className="mobile-switch-tabs" style={{ margin: '0 auto' }}>
    <button
      className={activeButton === 1 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(1)}>
      FORMATION
    </button>
    <button
      className={activeButton === 2 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(2)}>
      PERFORMERS
    </button>
    <button
      className={activeButton === 3 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(3)}>
      SHOW
    </button>
  </div>
);

class FrameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      sidePanelID: 0,
      frameName: '',
      activeButton: 1
    }
  }

  handleClick = (number) => {
    this.setState({ activeButton: number });
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
    const { activeButton } = this.state;
    return (
      <Fragment>
        <MobilePortrait>
          <Layout className="body">
            <Navigation title={this.props.danceName} history={this.props.history} danceId={this.props.danceId} />
            <Layout style={{ backgroundColor: 'transparent' }}>
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <SectionTitle mobile={true} frameName={this.props.frameName} handleEditName={this.handleEditName}
                  handleEditNameConfirm={this.handleEditNameConfirm} />
                <div style={{ height: '15rem', marginBottom: '10px' }}>
                  <ResponsiveStageCanvas danceId={this.props.danceId} frameId={this.props.frameId} editable withGrid />
                </div>
                <div>
                  <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                  {
                    activeButton === 1 &&
                    <div>
                    </div>
                  }
                  {
                    activeButton === 2 &&
                    <div>

                    </div>
                  }
                  {
                    activeButton === 3 &&
                    <div style={{height:"5rem"}}>
                      <Timeline danceId={this.props.danceId} />

                    </div>
                  }
                </div>
              </Content>
            </Layout>
          </Layout>
        </MobilePortrait>

        <MobileLandscape>
          <Layout className="body">
            <Navigation title={this.props.danceName} history={this.props.history} danceId={this.props.danceId} />
            <div style={{ background: '#000', flex: 1, overflow: "hidden" }}>
              <ResponsiveStageCanvas danceId={this.props.danceId} frameId={this.props.frameId} editable withGrid />
            </div>
          </Layout>
        </MobileLandscape>

        <MinTablet>
          <Layout className="body">
            <GradientSVG
              startColor="#24c6dc"
              endColor="#514a9d"
              idCSS="cool-gradient"
            />
            <Navigation title={this.props.danceName} history={this.props.history} danceId={this.props.danceId} />
            <Layout className="contents">
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <SectionTitle frameName={this.props.frameName} handleEditName={this.handleEditName}
                  handleEditNameConfirm={this.handleEditNameConfirm} />
                <div
                  className="framescreen-stage"
                  style={{ background: '#000', flex: 1, overflow: "hidden" }}
                >
                  <ResponsiveStageCanvas danceId={this.props.danceId} frameId={this.props.frameId} editable withGrid />
                </div>
              </Content>
              <Sider width={'12rem'} className="sider">
                <div className="button-container">
                  <Button className="sider-button" shape="circle" onClick={this.handleEditPerformer}>
                    <UserAddIcon style={{ fontSize: '33px' }} />
                  </Button>
                  <Button className="sider-button" shape="circle" onClick={this.handleAddFormation}>
                    <FileAddIcon style={{ fontSize: '25px' }} />
                  </Button>
                  <Button className="sider-button" shape="circle" onClick={this.handleEditTimeline}>
                    <HeadphoneIcon style={{ fontSize: '25px' }} />
                  </Button>
                </div>
                <PreviewSlideList danceId={this.props.danceId} />
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
        </MinTablet>
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

export default withAuthorization(authCondition)(withFireStoreSync(true)(connect(mapStateToProps)(FrameScreen)));
