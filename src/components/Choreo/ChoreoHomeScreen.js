import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { connect } from "react-redux";
import { getChoreo } from '../../selectors/choreo';
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

const DefaultSwitchTabs = ({activeButton, handleClick}) => (
  <div className="choreo-homescreen-tabs">
    <button
      className={activeButton === 1 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
      onClick={() => handleClick(1)}>
      ABOUT
    </button>
    <button
      className={activeButton === 2 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
      onClick={() => handleClick(2)}>
      PERFORMERS
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
      return <div>Invalid choreo</div>
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
        <MobilePortrait>
          <Header>
            <div className="nav-bar">
              <div>
                <Button className="mp-back-button" style={{ fontSize: '25px' }} icon="left"
                        onClick={() => this.props.history.push('/')}/>
              </div>
              <div className="mp-title">
                <h3>{this.props.name}</h3>
              </div>
              <div className="mp-right-container">
                <Menu mode="horizontal" theme="dark">
                  <Menu.Item className="mp-menu-item" key="1">
                    <Button icon="edit" ghost/>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Button icon="setting" ghost/>
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
          <Layout className="choreo-homescreen-contents" style={{}}>
            <ChoreoPicture/>
            <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick}/>
            {
              activeButton === 1
                ? <MobileFormationCards formations={this.props.formations} match={this.props.match}
                                        choreoId={this.props.choreoId}/>
                : activeButton === 2
                ? <div className="edit-performers">
                  <Button className="edit-performers-button" icon="edit" ghost block>EDIT</Button>
                </div>
                : <div>
                  <StageDimForm choreoId={this.props.choreoId}/>
                </div>
            }
          </Layout>
        </MobilePortrait>

        <MinTablet>
          {navbar}
          <Layout className="choreo-homescreen-contents">
            <Content style={{ display: "flex", flexDirection: "column" }}>
              <FormationPreviewCards formations={this.props.formations} match={this.props.match}
                                     choreoId={this.props.choreoId}/>
            </Content>
            <Sider width="20rem">
              <DefaultSwitchTabs activeButton={activeButton} handleClick={this.handleClick}/>
              {
                this.state.activeButton === 1
                  ? <div>
                    <ChoreoPicture/>
                    <h2 className="stagedim-title">STAGE DIMENSION</h2>
                    <StageDimForm choreoId={this.props.choreoId}/>
                  </div>
                  : <div className="edit-performers">
                    <PerformerList choreoId={this.props.choreoId}/>
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
  const choreoId = props.match.params.choreoId;
  const choreo = getChoreo(state, choreoId);
  if (choreo === undefined) {
    return {
      error: true
    }
  }
  return {
    formations: choreo.formations,
    name: choreo.name,
    choreoId: choreoId
  }
};

// Auth exists
// TODO: Check if authorized to edit choreo
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withFireStoreSync(true)((connect(mapStateToProps)(ChoreoHomeScreen))));
