import { Button, Layout, Menu } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ChoreoCardList from "./ChoreoCardList";
import withAuthorization from "../withAuthorization";
import { withRouter } from "react-router-dom";
import withFireStoreSync from "../withFirestoreSync";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class ChoreoListScreen extends React.Component {
  render() {
    const { Header, Content } = Layout;
    return (
      <Fragment>
        <MobilePortrait>
          <Header>
            <div className="nav-bar">
              <div className="mp-title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="mp-right-container">
                <Menu mode="horizontal" theme="dark">
                  <Menu.Item key="1">
                    <Button icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </MobilePortrait>

        <MobileLandscape>
          <Header>
            <div className="nav-bar">
              <div className="ml-title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="right-container">
                <Menu mode="horizontal" theme="dark">
                  <Menu.Item key="1">
                    <Button icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </MobileLandscape>

        <MinTablet>
          <Header>
            <div className="nav-bar">
              <div className="title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="right-container">
                <Menu mode="horizontal" theme="dark">
                  <Menu.Item key="1">
                    <Button icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </MinTablet>

        <Content>
          <ChoreoCardList data={this.props.choreoIds} match={this.props.match}
                          setModalVisible={this.props.setModalVisible} />
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    choreoIds: state.choreos.myChoreos
  }
};

// Auth exists
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(
  withFireStoreSync(false)(withRouter(connect(mapStateToProps)(ChoreoListScreen)))
);
