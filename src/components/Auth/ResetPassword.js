import React from 'react';
import './Auth.css';
import {Button, Layout} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";

class ResetPassword extends React.Component {

  render() {
       const {Header} = Layout;
    return (
    <Layout>
        <Header className="auth-header">
            <div>
              <Button className="auth-backbutton" style={{fontSize: '25px'}} icon="left"
                      onClick={() => this.props.history.goBack()}/>
              <span className="auth-backbutton-desc">Setting</span>
            </div>
        </Header>
         <div className="auth-background">
            <h1 className="auth-title">RESET PASSWORD</h1>
            <div className="auth-signup">
                <Button className="auth-signup-button" type="primary" htmlType="submit">SAVE</Button>
            </div>
         </div>
     </Layout>


    );
  }
}

export default ResetPassword;
