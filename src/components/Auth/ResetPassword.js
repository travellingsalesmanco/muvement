import React from 'react';
import './Auth.css';
import { Button, Layout } from 'antd';
import { auth } from '../../firebase';
import withAuthorization from "../withAuthorization";

class ResetPassword extends React.Component {
  state = {
    loading: false,
    disabled: false,
    sent: false
  };

  handleSubmit = () => {
    this.setState({
        loading: true,
        disabled: true,
      }, () => auth.doPasswordResetInAccount().then(() => this.setState({
        loading: false,
        disabled: false,
        sent: true
      }))
    );
  };

  // TODO: Fix styling issues
  render() {
    const { Header } = Layout;
    const { loading, disabled, sent } = this.state;
    return (
      <Layout>
        <Header className="auth-header">
          <div>
            <Button className="auth-backbutton" style={{ fontSize: '25px' }} icon="left"
                    onClick={() => this.props.history.goBack()} />
            <span className="auth-backbutton-desc">Setting</span>
          </div>
        </Header>
        <div className="auth-background">
          <h1 className="auth-forgetpw-title">RESET PASSWORD</h1>
          <div>
            {
              sent
                ? <span className={"auth-text"}>An email has been sent to you!</span>
                : <Button className="auth-signup-button" type="primary" htmlType="submit"
                          onClick={() => this.handleSubmit()}
                          loading={loading}
                          disabled={disabled}
                >Send me an email</Button>
            }
          </div>
        </div>
      </Layout>


    );
  }
}

// Auth exists
const authCondition = (authUser) => !!authUser;
const failRoute = '/';

export default withAuthorization(authCondition, failRoute)(ResetPassword);
