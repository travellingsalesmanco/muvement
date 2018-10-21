import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { connect } from "react-redux";
import { getDance } from '../../selectors/dance';
import StageDimForm from "../Formation/StageDimForm";
import { MinTablet, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import withAuthorization from "../withAuthorization";
import withFireStoreSync from "../withFirestoreSync";
import './ChoreoHomeScreen.css';
import ChoreoPicture from "./ChoreoPicture";
import FormationPreviewCards from "./FormationPreviewCards";
import MobileFormationCards from "./MobileFormationCards";
import PerformerList from "./PerformerList";

const MobileSwitchTabs = ({activeButton, handleClick}) => (
  <div className="mobile-switch-tabs">
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
      STAGE DIM
    </button>
  </div>
);

class ChoreoHomeScreen extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    activeButton : 1
  };

  handleClick = (number) => {
    this.setState({activeButton: number});
  };

  render() {
    if (this.props.error) {
      return <div>Invalid dance</div>
    }
    const {Header, Content, Sider} = Layout;
    const {activeButton} = this.state;
    const navbar = (
      <Header>
        <div className="nav-bar">
          <div>
            <Button style={{fontSize: '25px'}} icon="left"
                    onClick={() => this.props.history.push('/')}/>
            <MinTablet>
              <span className="backbutton-desc">Dashboard</span>
            </MinTablet>
          </div>
          <div className="title">
            <h3>{this.props.name}</h3>
          </div>
          <div className="right-container">
            <Menu mode="horizontal" theme="dark">
              <Menu.Item key="1">
                <Button icon="edit" ghost/>
              </Menu.Item>
              <Menu.Item key="2">
                <Button icon="setting" ghost/>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </Header>
    );
    return (
      <Layout className="choreo-homescreen-body">
        {navbar}
        <MobilePortrait>
          <Layout className="choreo-homescreen-contents" style={{}}>
            <ChoreoPicture/>
            <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick}/>
            {
              activeButton === 1
                ? <MobileFormationCards frames={this.props.frames} match={this.props.match} danceId={this.props.danceId}/>
                : activeButton === 2
                  ? <div className="edit-performers">
                      <Button className="edit-performers-button" icon="edit" ghost block>EDIT</Button>
                    </div>
                  : <div>
                      <StageDimForm danceId={this.props.danceId}/>
                    </div>
            }
          </Layout>
        </MobilePortrait>
        <MinTablet>
          <Layout className="choreo-homescreen-contents">
            <Content style={{display: "flex", flexDirection: "column"}}>
              <FormationPreviewCards frames={this.props.frames} match={this.props.match} danceId={this.props.danceId}/>
            </Content>
            <Sider width="20rem">
              <div className="choreo-homescreen-tabs">
                <button
                  className={this.state.activeButton === 1 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                  onClick={() => this.handleClick(1)}>
                  ABOUT
                </button>
                <button
                  className={this.state.activeButton === 2 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                  onClick={() => this.handleClick(2)}>
                  PERFORMERS
                </button>
              </div>
              {
                this.state.activeButton === 1
                  ? <div>
                    <ChoreoPicture/>
                    <h2 className="stagedim-title">STAGE DIMENSION</h2>
                    <StageDimForm danceId={this.props.danceId}/>
                  </div>
                  : <div className="edit-performers">
                    <PerformerList danceId={this.props.danceId}/>
                  </div>
              }
            </Sider>
          </Layout>
        </MinTablet>
      </Layout>
    );
  }
}

const mapStateToProps = (state, props) => {
  const danceId = props.match.params.choreoId;
  const dance = getDance(state, danceId);
  if (dance === undefined) {
    return {
      error: true
    }
  }
  return {
    frames: dance.frames,
    name: dance.name,
    danceId: danceId
  }
};

// Auth exists
// TODO: Check if authorized to edit dance
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withFireStoreSync(true)((connect(mapStateToProps)(ChoreoHomeScreen))));
