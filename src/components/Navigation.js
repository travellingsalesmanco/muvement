import React from "react";
import {Button, Layout, Menu} from "antd";
import './Navigation.css';

class Navigation extends React.Component {
  render() {
    const { Header } = Layout;
    return (
      <Header>
        <div className="nav-bar">
          <div className="back-button">
            <Button style={{ fontSize: '25px' }} icon="left" onClick={() => this.props.history.goBack()}/>
          </div>
          <div className="title">
            <h3 style={{ color: '#fff'}}>{this.props.title}</h3>
          </div>
          <div className="right-container">
            <Menu className="navbar-icon" mode="horizontal" theme="dark">
            {/* TODO: Make the size of the icon bigger */}
              <Menu.Item key="1">
                <Button className="navbar-button" icon="undo" ghost/>
              </Menu.Item>
              <Menu.Item key="2">
                <Button icon="redo"/>
              </Menu.Item>
              <Menu.Item key="3">
                <Button icon="eye"/>
              </Menu.Item>
              <Menu.Item key="4">
                <Button icon="fullscreen"/>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </Header>
    );
  }
}

export default Navigation;
