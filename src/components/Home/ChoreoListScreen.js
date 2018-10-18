import React, {Fragment} from 'react';
import {Button, Input, Layout, Menu} from 'antd';
import ChoreoCards from "./ChoreoCards";
import {connect} from 'react-redux';

class ChoreoListScreen extends React.Component {
  render() {
    const {Header, Content} = Layout;
    return (
      <Fragment>
        <Header>
          <div className="nav-bar">
            <div className="title">
              <h3 style={{ color: '#fff'}}>DASHBOARD</h3>
            </div>
            <div className="right-container">
              <Menu mode="horizontal" theme="dark">
                <Menu.Item key="1">
                  <Button icon="setting" ghost/>
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Header>
        <Content>
          <ChoreoCards data={this.props.dances} match={this.props.match} setModalVisible={this.props.setModalVisible}/>
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    dances: state.dances
  }
};

export default connect(mapStateToProps)(ChoreoListScreen);
