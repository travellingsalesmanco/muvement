import {Button, Col, Drawer, Icon, Row} from "antd";
import React from 'react';
import './SidePanel.css';
import PerformerItem from "./PerformerItem";

class Title extends React.Component {
  render() {
    const performerTitle = (
      <Row type="flex" justify="center">
        <Col span={5}>
          <Icon type="user-add" theme="outlined"/>
        </Col>
        <Col span={15}><p>Performers</p></Col>
      </Row>
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
      editPerformers: false
    };
  }

  handleEditToggle = () => {
    this.setState({
      editPerformers: !this.state.editPerformers
    })
  };

  // TODO: CSS to prettify list
  render() {
    const AddPerformersButton = (
      <Button type={"dashed"} icon="user-add" ghost block>Add Performer</Button>
    );
    const EditPerformersButton = (
      <Button type={"dashed"} icon="tool" ghost block onClick={this.handleEditToggle}>Edit Performers</Button>
    );
    const dancerList = (
      this.state.dancers.map((dancer, key) => {
        return <PerformerItem id={key} name={dancer} editable={this.state.editPerformers}/>
      })
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
          this.props.id === 1 && (
            <div>
              {dancerList}
              {AddPerformersButton}
              {EditPerformersButton}
            </div>
          )
        }
      </Drawer>
    );
  }
}

export default SidePanel;