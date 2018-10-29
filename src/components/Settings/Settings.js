import React from 'react';
import './Settings.css';
import { Button, Layout, List, Icon, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { USER_LOGOUT } from '../../constants/actionTypes';
import Terms from "../Static/Terms";
import Privacy from "../Static/Privacy";


class Settings extends React.Component {
  state = {
    termsVisible: false,
    privacyVisible: false
  };


  handleLogout = () => {
    this.props.dispatch({ type: USER_LOGOUT }).then(this.props.history.push('/landing'));
  };

  showTerms = () => {
    this.setState({
      termsVisible: true,
      privacyVisible: false
    });
  };

  showPrivacy = () => {
    this.setState({
      termsVisible: false,
      privacyVisible: true
    });
  };

  handleClose = () => {
    this.setState({
      termsVisible: false,
      privacyVisible: false
    });
  };


  render() {
    const { Header } = Layout;
    const LIST_BUTTONS = [
      {
        element: <span><Icon type="lock" /><span>Reset Password</span></span>,
        clickHandler: () => this.props.history.push(`/resetpassword`)
      },
      {
        element: <span><Icon type="exception" /><span>Terms of Service</span></span>,
        clickHandler: this.showTerms
      },
      {
        element: <span><Icon type="solution" /><span>Privacy Policy</span></span>,
        clickHandler: this.showPrivacy
      },
      {
        element: <span><Icon type="logout" /><span>Log Out</span></span>,
        clickHandler: this.handleLogout
      },

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
            renderItem={item => (
              <List.Item className="settings-item" onClick={item.clickHandler}>{item.element}</List.Item>)}
          />
        </div>
        <Modal
          title="Terms of Service"
          visible={this.state.termsVisible}
          onOk={this.handleClose}
          onCancel={this.handleClose}
          maskClosable={true}
        >
          {<Terms/>}
        </Modal>
        <Modal
          title="Privacy Policy"
          visible={this.state.privacyVisible}
          onOk={this.handleClose}
          onCancel={this.handleClose}
          maskClosable={true}
        >
          {<Privacy/>}
        </Modal>
      </Layout>


    );
  }
}

export default withRouter(connect()(Settings));
