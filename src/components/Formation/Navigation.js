import React from "react";
import { Button, Layout, Menu } from "antd";
import { connect } from 'react-redux';
import './Navigation.css';
import '../Home/AddPerformerScreen.css';
import RedoIcon from "../../icons/RedoIcon";
import UndoIcon from "../../icons/UndoIcon";
import { toggleLabels } from "../../actions/choreoActions";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import { undoFormationsChange, redoFormationsChange } from "../../actions/choreoActions";
import { canRedo, canUndo } from "../../lib/historyUtils";

class Navigation extends React.Component {
  render() {
    const { Header } = Layout;
    const { choreoId, canUndo, canRedo, editable, handleShowProperties, trial } = this.props;
    console.log("CAN UNDO: " + canUndo);
    console.log("CAN REDO: " + canRedo);
    const undoStyle = canUndo
      ? {
        cursor: 'pointer',
        color: '#fff'
      }
      : {
        pointerEvents: 'None',
        cursor: 'not-allowed',
        color: '#999'
      };
    const redoStyle = canRedo
      ? {
        cursor: 'pointer',
        color: '#fff'
      }
      : {
        pointerEvents: 'None',
        cursor: 'not-allowed',
        color: '#999'
      };
    return (
      <Header>
        <MobilePortrait>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left"
                      onClick={() => {
                        if (trial) {
                          this.props.openModal('back')
                        } else {
                          this.props.history.push(`/dashboard`)
                        }}} />
            </div>
            <div className="mp-title">
              <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
            </div>
            <div className="mp-right-container">
              <Button className="nav-bar-button"
                      onClick={() => this.props.dispatch(undoFormationsChange(choreoId))}
                      style={undoStyle}
              >
                <UndoIcon />
              </Button>
              <Button className="nav-bar-button"
                      onClick={() => this.props.dispatch(redoFormationsChange(choreoId))}
                      style={redoStyle}
              >
                <RedoIcon />
              </Button>
              <Button icon="eye" onClick={() => this.props.dispatch(toggleLabels())} />
              {editable && <Button icon="info-circle" onClick={handleShowProperties} />}
            </div>
          </div>
        </MobilePortrait>

        <MobileLandscape>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left"
                      onClick={() => this.props.history.push(`/dashboard`)} />
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
                      onClick={() => {
                        if (trial) {
                          this.props.openModal('back')
                        } else {
                          this.props.history.push(`/dashboard`)
                        }}} />
            </div>
            <div className="title">
              <h3 style={{ color: '#fff' }}>{this.props.title}</h3>
            </div>
            <div className="right-container">
              <Button className="nav-bar-button"
                      onClick={() => this.props.dispatch(undoFormationsChange(choreoId))}
                      style={undoStyle}
              >
                <UndoIcon />
              </Button>
              <Button className="nav-bar-button"
                      onClick={() => this.props.dispatch(redoFormationsChange(choreoId))}
                      style={redoStyle}
              >
                <RedoIcon />
              </Button>
              {/* TODO: change eye icon depending on current show state */}
              <Button icon="eye" onClick={() => this.props.dispatch(toggleLabels())} />
              {editable && <Button icon="info-circle" onClick={handleShowProperties} />}
              {
                trial &&
                  <Button onClick={() => this.props.openModal('save')}>
                    <span>SAVE</span>
                  </Button>
              }
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
