import React from "react";
import { Button, Layout, Menu } from "antd";
import { connect } from 'react-redux';
import './Navigation.css';
import RedoIcon from "../../icons/RedoIcon";
import UndoIcon from "../../icons/UndoIcon";
import { toggleLabels } from "../../actions/choreoActions";
import { MinTablet, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class Navigation extends React.Component {
  render() {
    const { Header } = Layout;
    return (
      <Header>
        <div className="nav-bar">
          <div className="back-button">
            <Button style={{ fontSize: '25px' }} icon="left"
                    onClick={() => this.props.history.push(`/choreo/${this.props.choreoId}`)} />
          </div>
          <div className="title">
            <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
          </div>
          <MobilePortrait>
            <div className="right-container">
              <Menu className="navbar-icon" mode="horizontal" theme="dark">
                <Menu.Item key="1">
                  <Button className="nav-bar-button">
                    <UndoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button className="nav-bar-button">
                    <RedoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="3">
                  <Button icon="eye" />
                </Menu.Item>
              </Menu>
            </div>
          </MobilePortrait>
          <MinTablet>
            <div className="right-container">
              <Menu className="navbar-icon" mode="horizontal" theme="dark">
                {/* TODO: Make the size of the icon bigger */}
                <Menu.Item key="1">
                  <Button className="nav-bar-button">
                    <UndoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button className="nav-bar-button">
                    <RedoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="3">
                  {/* TODO: change eye icon depending on current show state */}
                  <Button icon="eye" onClick={() => this.props.dispatch(toggleLabels())} />
                </Menu.Item>
                <Menu.Item key="4">
                  <Button icon="fullscreen" />
                </Menu.Item>
              </Menu>
            </div>
          </MinTablet>
        </div>
      </Header>
    );
  }
}

function mapStateToProps(state) {
  return {
    showLabels: state.UI.showLabels,
  }
}

export default connect(mapStateToProps)(Navigation);
