import React from 'react';
import './Settings.css';
import { Button, Layout, List, Icon } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { USER_LOGOUT } from '../../constants/actionTypes';


class Settings extends React.Component {
  handleLogout = () => {
    this.props.dispatch({ type: USER_LOGOUT }).then(this.props.history.push('/landing'));
  };

  render() {
    const { Header } = Layout;
    const LIST_BUTTONS = [
      <span onClick={() => this.props.history.push(`/resetpassword`)}><Icon
        type="lock" /><span>Reset Password</span></span>,
      <span onClick={() => window.open('https://muvement.app/terms','_blank')}><Icon type="exception" /><span>Terms</span></span>,
      <span onClick={() => window.open('https://muvement.app/privacy','_blank')}><Icon
        type="solution" /><span>Privacy Policy</span></span>,
      <span onClick={this.handleLogout}><Icon type="logout" /><span>Log Out</span></span>

    ];
    return (
      <Layout style={{ height: "100vh" }}>
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
          <List
            split={false}
            dataSource={LIST_BUTTONS}
            renderItem={item => (<List.Item className="settings-title">{item}</List.Item>)}
          />
        </div>
      </Layout>


    );
  }
}

export default withRouter(connect()(Settings));
