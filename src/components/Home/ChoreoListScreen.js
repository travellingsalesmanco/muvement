import { Button, Layout, Menu, Spin } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { loadingIcon } from "../../icons/LoadingIcon";
import ChoreoCardList from "./ChoreoCardList";
import withAuthorization from "../withAuthorization";
import { withRouter } from "react-router-dom";
import withFireStoreSync from "../withFirestoreSync";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class ChoreoListScreen extends React.Component {
  state = {
    editState: false
  }

  handleMenuClick = (item) => {
    if (item.key === '1') {
      this.setState(prevState => ({
        editState: !prevState.editState
      }))
    }
  };

  render() {
    const { Header, Content } = Layout;
    const { loading } = this.props;
    return (
      <Fragment>
        <MobilePortrait>
          <Header>
            <div className="nav-bar">
              <div className="mp-dashboard-title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="mp-right-container">
                <Menu mode="horizontal" theme="dark" onClick={this.handleMenuClick}>
                  <Menu.Item className="mp-menu-item" key="1">
                    {
                      this.state.editState
                        ? <Button icon="close" ghost />
                        : <Button icon="edit" ghost />
                    }
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Button className="mp-setting" icon="setting" onClick={() => this.props.history.push(`/settings`)}
                            ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </MobilePortrait>

        <MobileLandscape>
          <Header>
            <div className="nav-bar">
              <div className="ml-dashboard-title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="right-container">
                <Menu mode="horizontal" theme="dark" onClick={this.handleMenuClick}>
                  <Menu.Item className="mp-menu-item" key="1">
                    {
                      this.state.editState
                        ? <Button icon="close" ghost />
                        : <Button icon="edit" ghost />
                    }
                  </Menu.Item>
                  <Menu.Item key="2">
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
              <div className="dashboard-title">
                <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
              </div>
              <div className="right-container">
                <Menu mode="horizontal" theme="dark" onClick={this.handleMenuClick}>
                  <Menu.Item className="mp-menu-item" key="1">
                    {
                      this.state.editState
                        ? <Button icon="close" ghost />
                        : <Button icon="edit" ghost />
                    }
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Button icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
        </MinTablet>

        <Content>
          <Spin indicator={loadingIcon} spinning={loading}>
            <ChoreoCardList data={this.props.choreoIds} match={this.props.match}
                            setModalVisible={this.props.setModalVisible} editState={this.state.editState}/>
          </Spin>
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
const failRoute = "/landing";

export default withAuthorization(authCondition, failRoute)(
  withFireStoreSync(false)(withRouter(connect(mapStateToProps)(ChoreoListScreen)))
);
