import React from "react";
import { Button, Layout, Menu } from "antd";
import { connect } from 'react-redux';
import './Navigation.css';
import RedoIcon from "../../icons/RedoIcon";
import UndoIcon from "../../icons/UndoIcon";
import { toggleLabels } from "../../actions/choreoActions";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import { undoFormationsChange, redoFormationsChange } from "../../actions/choreoActions";
import { canRedo, canUndo } from "../../lib/historyUtils";

class Navigation extends React.Component {
  render() {
    const { Header } = Layout;
    const { choreoId, canUndo, canRedo } = this.props;
    console.log("CAN UNDO: " + canUndo);
    console.log("CAN REDO: " + canRedo);
    return (
      <Header>
        <MobilePortrait>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left"
                      onClick={() => this.props.history.push(`/choreo/${choreoId}`)} />
            </div>
            <div className="mp-title">
              <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
            </div>
            <div className="mp-right-container">
              <Menu className="navbar-icon" mode="horizontal" theme="dark">
                <Menu.Item className="mp-menu-item" key="1">
                  <Button className="nav-bar-button"
                          onClick={() => this.props.dispatch(undoFormationsChange(choreoId))}
                          disabled={!canUndo}
                  >
                    <UndoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button className="nav-bar-button"
                          onClick={() => this.props.dispatch(redoFormationsChange(choreoId))}
                          disabled={!canRedo}
                  >
                    <RedoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item className="mp-menu-item" key="3">
                  <Button icon="eye" onClick={() => this.props.dispatch(toggleLabels())} />
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </MobilePortrait>

        <MobileLandscape>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left"
                      onClick={() => this.props.history.push(`/choreo/${choreoId}`)} />
            </div>
            <div className="mp-title">
              <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
            </div>
          </div>
        </MobileLandscape>

        <MinTablet>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left"
                      onClick={() => this.props.history.push(`/choreo/${choreoId}`)} />
            </div>
            <div className="title">
              <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
            </div>
            <div className="right-container">
              <Menu className="navbar-icon" mode="horizontal" theme="dark">
                {/* TODO: Make the size of the icon bigger */}
                <Menu.Item key="1">
                  <Button className="nav-bar-button"
                          onClick={() => this.props.dispatch(undoFormationsChange(choreoId))}
                          disabled={!canUndo}
                  >
                    <UndoIcon />
                  </Button>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button className="nav-bar-button"
                          onClick={() => this.props.dispatch(redoFormationsChange(choreoId))}
                          disabled={!canRedo}
                  >
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
          </div>
        </MinTablet>
      </Header>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    showLabels: state.UI.showLabels,
    canUndo: canUndo(props.choreoId),
    canRedo: canRedo(props.choreoId)
  }
}

export default connect(mapStateToProps)(Navigation);
