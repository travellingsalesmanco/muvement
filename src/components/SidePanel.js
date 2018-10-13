import {Button, Drawer, Icon} from "antd";
import React from 'react';
import './SidePanel.css';
import PerformerItem from "./PerformerItem";
import StageDimForm from "./StageDimForm";

class Title extends React.Component {
  render() {
    const performerTitle = (
      <div>
        <Icon type="user-add" theme="outlined"/>
        <span>Performers</span>
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
  constructor(props) {
    super(props);
    // TODO: Take performer list or stage dims from redux state
    this.state = {
      dancers: [
        "Bob",
        "Marley",
        "And",
        "Me"
      ],
      editPerformers: false,
      stageDim: {
        width: 9.60,
        height: 5.18
      }
    };
  }

  handleEditToggle = () => {
    this.setState({
      editPerformers: !this.state.editPerformers
    })
  };


  // TODO: CSS to prettify list
  render() {
    let drawerDisplay;
    if (this.props.id === 1) {
      drawerDisplay = (
        <div>
          {this.state.dancers.map((dancer, key) => {
            return <PerformerItem key={key} id={key} name={dancer} editable={this.state.editPerformers}/>
          })}
          <Button type={"dashed"} icon="user-add" ghost block>Add Performer</Button>
          <Button type={"dashed"} icon="tool" ghost block onClick={this.handleEditToggle}>Edit Performers</Button>
        </div>
      )
    } else if (this.props.id === 4) {
      drawerDisplay = (
        <div>
          <StageDimForm danceId={0}/>
        </div>
      )
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