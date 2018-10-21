import { Button, Layout, Menu } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import ChoreoCardList from "./ChoreoCardList";
import withAuthorization from "../withAuthorization";
import { withRouter } from "react-router-dom";


class ChoreoListScreen extends React.Component {
  render() {
    const { Header, Content } = Layout;
    return (
      <Fragment>
        <Header>
          <div className="nav-bar">
            <div className="title">
              <h3 style={{ color: '#fff' }}>DASHBOARD</h3>
            </div>
            <div className="right-container">
              <Menu mode="horizontal" theme="dark">
                <Menu.Item key="1">
                  <Button icon="setting" onClick={() => this.props.history.push(`/settings`)} ghost/>
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Header>
        <Content>
          <ChoreoCardList data={this.props.danceIds} match={this.props.match} setModalVisible={this.props.setModalVisible} />
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    danceIds: state.dances.myDances
  }
};

// Auth exists
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withRouter((connect(mapStateToProps)(ChoreoListScreen))));
