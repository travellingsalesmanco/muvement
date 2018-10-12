import {Drawer} from "antd";
import React from 'react';
import './SidePanel.css';

class Title extends React.Component {
  render() {
    const performerTitle = (
      <p>Performers</p>
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
  constructor(props) {
    super(props);
  }
  render() {
    const performers = (
      <p>Add performers</p>
    );
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
        {
          this.props.id === 1 && performers
        }
      </Drawer>
    );
  }
}

export default SidePanel;