import { Button, Layout, Menu, Spin, BackTop, Icon } from 'antd';
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import { loadingIcon } from "../../icons/LoadingIcon";
import { getChoreo } from '../../selectors/choreo';
import StageDimForm from "../Formation/StageDimForm";
import { MinTablet, MobilePortrait, TabletPortrait } from "../ResponsiveUtils/BreakPoint";
import withAuthorization from "../withAuthorization";
import withFireStoreSync from "../withFirestoreSync";
import './ChoreoHomeScreen.css';
import ChoreoPicture from "./ChoreoPicture";
import FormationPreviewCards from "./FormationPreviewCards";
import MobileFormationCards from "./MobileFormationCards";
import PerformerList from "./PerformerList";

const MobileSwitchTabs = ({ activeButton, handleClick }) => (
  <div className="mobile-switch-tabs-home">
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

const DefaultSwitchTabs = ({ activeButton, handleClick }) => (
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
    activeButton: 1,
    editState: false
  };

  handleClick = (number) => {
    this.setState({ activeButton: number });
  };

  handleMenuClick = (item) => {
      this.setState(prevState => ({
        editState: !prevState.editState
      }))
  };

  render() {
    if (this.props.error) {
      return <div>Invalid choreo</div>
    }
    const { Header, Content, Sider } = Layout;
    const { activeButton } = this.state;
    const { loading } = this.props;
    return (
      <Fragment>
        <MobilePortrait>
          <Layout className="mp-choreo-homescreen-body">
            <Header>
              <div className="nav-bar">
                <div>
                  <Button className="mp-back-button" style={{ fontSize: '25px' }} icon="left"
                          onClick={() => this.props.history.push('/')} />
                </div>
                <div className="mp-title">
                  <h3>{this.props.name}</h3>
                </div>
                <div className="mp-right-container">
                      {
                        this.state.editState
                          ? <Button onClick={this.handleMenuClick} icon="close" ghost />
                          : <Button onClick={this.handleMenuClick} icon="edit" ghost />
                      }
                      <Button className="mp-setting" icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost />
                </div>
              </div>
            </Header>
            <Layout className="choreo-homescreen-contents" style={{}}>
              <Spin indicator={loadingIcon} spinning={loading}>
                <ChoreoPicture choreoId={this.props.choreoId} imageUrl={this.props.choreoImageUrl} />
                <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                {
                  activeButton === 1
                    ? <MobileFormationCards formations={this.props.formations} match={this.props.match}
                                            choreoId={this.props.choreoId} editState={this.state.editState} />
                    : activeButton === 2
                    ? <div className="edit-performers">
                      <PerformerList choreoId={this.props.choreoId} />
                    </div>
                    : <div>
                      <StageDimForm choreoId={this.props.choreoId} />
                    </div>
                }
                <BackTop className="back-top"/>
              </Spin>
            </Layout>
          </Layout>
        </MobilePortrait>

        <TabletPortrait>
          <Layout className="choreo-homescreen-body">
            <Header>
              <div className="nav-bar">
                <div>
                  <Button style={{ fontSize: '25px' }} icon="left"
                          onClick={() => this.props.history.push('/')} />
                  <MinTablet>
                    <span className="backbutton-desc">Dashboard</span>
                  </MinTablet>
                </div>
                <div className="title">
                  <h3>{this.props.name}</h3>
                </div>
                <div className="right-container">
                      {
                        this.state.editState
                          ? <Button onClick={this.handleMenuClick} icon="close" ghost />
                          : <Button onClick={this.handleMenuClick} icon="edit" ghost />
                      }
                      <Button icon="setting" ghost onClick={() => this.props.history.push(`/settings`)}/>
                </div>
              </div>
            </Header>
            <Layout className="choreo-homescreen-contents">
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <FormationPreviewCards formations={this.props.formations} match={this.props.match}
                                       choreoId={this.props.choreoId} editState={this.state.editState} />
              </Content>
              <Sider width="18rem">
                <DefaultSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                {
                  this.state.activeButton === 1
                    ? <div>
                      <ChoreoPicture choreoId={this.props.choreoId} imageUrl={this.props.choreoImageUrl} />
                      <h2 className="stagedim-title">STAGE DIMENSION</h2>
                      <StageDimForm choreoId={this.props.choreoId} />
                    </div>
                    : <div className="edit-performers">
                      <PerformerList choreoId={this.props.choreoId} />
                    </div>
                }
              </Sider>
            </Layout>
          </Layout>
        </TabletPortrait>

        <MinTablet>
          <Layout className="choreo-homescreen-body">
            <Header>
              <div className="nav-bar">
                <div>
                  <Button style={{ fontSize: '25px' }} icon="left"
                          onClick={() => this.props.history.push('/')} />
                  <MinTablet>
                    <span className="backbutton-desc">Dashboard</span>
                  </MinTablet>
                </div>
                <div className="title">
                  <h3>{this.props.name}</h3>
                </div>
                <div className="right-container">
                      {
                        this.state.editState
                          ? <Button onClick={this.handleMenuClick} icon="close" ghost />
                          : <Button onClick={this.handleMenuClick} icon="edit" ghost />
                      }
                      <Button icon="setting" ghost onClick={() => this.props.history.push(`/settings`)}/>
                </div>
              </div>
            </Header>
            <Layout className="choreo-homescreen-contents">
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <FormationPreviewCards formations={this.props.formations} match={this.props.match}
                                       choreoId={this.props.choreoId} editState={this.state.editState} />
              </Content>
              <Sider width="20rem">
                <DefaultSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                {
                  this.state.activeButton === 1
                    ? <div>
                      <ChoreoPicture choreoId={this.props.choreoId} imageUrl={this.props.choreoImageUrl} />
                      <h2 className="stagedim-title">STAGE DIMENSION</h2>
                      <StageDimForm choreoId={this.props.choreoId} />
                    </div>
                    : <div className="edit-performers">
                      <PerformerList choreoId={this.props.choreoId} />
                    </div>
                }
              </Sider>
            </Layout>
          </Layout>
        </MinTablet>
      </Fragment>
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
    choreoId: choreoId,
    choreoImageUrl: choreo.imageUrl
  }
};

// Auth exists
const authCondition = (authUser) => !!authUser;
const failRoute = "/";

export default withAuthorization(authCondition, failRoute)(withFireStoreSync(true)((connect(mapStateToProps)(ChoreoHomeScreen))));
