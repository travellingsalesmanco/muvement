import React from 'react';
import './Settings.css';
import { Button, Layout, Menu, Icon } from 'antd';
import { BrowserRouter as Route, withRouter } from "react-router-dom";
import { auth } from "../../firebase";
import {connect} from 'react-redux'
import { USER_LOGOUT } from '../../constants/actionTypes';


class Settings extends React.Component {
  handleLogout = () => {
    this.props.dispatch({type: USER_LOGOUT}).then(this.props.history.push('/landing'));
  }

  render() {
    const { Header } = Layout;
    const SubMenu = Menu.SubMenu;
    return (
      <Layout style={{height:"100vh"}}>
        <Header className="settings-header">
          <div className="settings-navbar">
            <div>
              <Button className="auth-backbutton" style={{ fontSize: '23px' }} icon="left"
                      onClick={() => this.props.history.goBack()} />

            </div>
            <div className="settings-title">
              <h1 style={{ color: '#fff' }}>SETTINGS</h1>
            </div>
          </div>
        </Header>
        <div className="settings-background">
          <Menu className="settings-menu" mode="vertical">
            <SubMenu key="resetpw" className="settings-menu-item"
                     onTitleClick={() => this.props.history.push(`/resetpassword`)}
                     title={<span><Icon type="lock" /><span>Reset Password</span></span>}>
            </SubMenu>
            <SubMenu key="logout" className="settings-menu-item"
                     onTitleClick={this.handleLogout}
                     title={<span><Icon type="logout" /><span>Logout</span></span>}>
            </SubMenu>

          </Menu>
        </div>
      </Layout>


    );
  }
}

export default withRouter(connect()(Settings));
