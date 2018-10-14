import {Button, Drawer, Icon} from "antd";
import React from 'react';
import './SidePanel.css';
import UserAddIcon from "../icons/UserAddIcon";
import PerformerList from "./PerformerList";
import StageDimForm from "./StageDimForm";

class Title extends React.Component {
  render() {
    const performerTitle = (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <UserAddIcon style={{ fontSize: '30px' }}/>
        <span style={{fontFamily: 'Futura-Bold'}}>PERFORMERS</span>
      </div>

    );

    const stageDimTitle = (
      <p>Stage Dimension</p>
    );
    const sampleTitle = (
      <p>Drawer</p>
    );
    return (
      <div>
        {
          this.props.id === 1
            ? performerTitle
            : this.props.id === 4
            ? stageDimTitle
            : sampleTitle
        }
      </div>
    );
  }
}


class SidePanel extends React.Component {




  // TODO: CSS to prettify list
  render() {
    let drawerDisplay;
    if (this.props.id === 1) {
      drawerDisplay = <PerformerList />
    } else if (this.props.id === 4) {
      drawerDisplay = <StageDimForm/>
    }

    return (
      <Drawer
        title={<Title id={this.props.id}/>}
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