import { Drawer } from "antd";
import React from 'react';
import './SidePanel.css';
import BorderInnerIcon from "../../icons/BorderInnerIcon";
import UserAddIcon from "../../icons/UserAddIcon";
import PerformerList from "./PerformerList";
import StageDimForm from "./StageDimForm";

class Title extends React.Component {
  render() {
    const performerTitle = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <UserAddIcon className="side-panel-icon" style={{ fontSize: '34px' }} />
        <span style={{ fontFamily: 'Sen-Black', marginLeft: '5px' }}>PERFORMERS</span>
      </div>
    );

    const stageDimTitle = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BorderInnerIcon className="side-panel-icon" style={{ fontSize: '30px' }} />
        <span style={{ fontFamily: 'Sen-Bold', marginLeft: '10px' }}>STAGE DIMENSION</span>
      </div>
    );
    return (
      <div>
        {
          this.props.id === 1
            ? performerTitle
            : this.props.id === 4
            ? stageDimTitle
            : null
        }
      </div>
    );
  }
}


class SidePanel extends React.Component {
  render() {
    let drawerDisplay;
    if (this.props.id === 1) {
      drawerDisplay = <PerformerList danceId={this.props.danceId}/>
    } else if (this.props.id === 4) {
      drawerDisplay = <StageDimForm danceId={this.props.danceId}/>
    }

    return (
      <Drawer
        title={<Title id={this.props.id} />}
        placement={this.props.placement}
        closable={this.props.closable}
        onClose={this.props.onClose}
        visible={this.props.visible}
        mask={this.props.mask}
        width={this.props.width}
      >
        {drawerDisplay}
      </Drawer>
    );
  }
}

export default SidePanel;
