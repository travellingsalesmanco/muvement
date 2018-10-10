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
            <Button icon="left"/>
          </div>
          <div className="title">
            {/* TODO: Make responsive design not collapse title text */}
            <h3 style={{ color: '#fff'}}>NUS BLAST! SHOWCASE</h3>
          </div>
          <div className="right-container">
            <Menu mode="horizontal" theme="dark">
              <Menu.Item key="1">
                <Button icon="undo" ghost/>
              </Menu.Item>
              <Menu.Item key="2">
                <Button icon="redo"/>
              </Menu.Item>
              <Menu.Item key="3">
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