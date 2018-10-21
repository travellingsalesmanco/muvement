import React from 'react';
import './Settings.css';
import { Button, Layout, Menu, Icon } from 'antd';
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Route, withRouter } from "react-router-dom";
import { auth } from "../../firebase";


class Settings extends React.Component {

  render() {
    const { Header } = Layout;
    const SubMenu = Menu.SubMenu;
    return (
      <Layout>
        <Header className="settings-header">
          <div className="settings-navbar">
            <div>
              <Button className="auth-backbutton" style={{ fontSize: '25px' }} icon="left"
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
            <SubMenu key="logout" className="settings-menu-item" onTitleClick={auth.doSignOut}
                     title={<span><Icon type="logout" /><span>Logout</span></span>}>
            </SubMenu>

          </Menu>
        </div>
      </Layout>


    );
  }
}

export default withRouter(Settings);
