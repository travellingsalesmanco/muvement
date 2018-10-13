import React from 'react';
import {Row, Col, Icon} from "antd";

class PerformerItem extends React.Component {

  removeDancer(key) {
    // TODO: Remove dancer through redux on click of icon
    console.log("Remove dancer: " + key);
  }

  addDancer(key) {
    // TODO: Add dancer through redux on click of name
    console.log("Add dancer to stage: " + key);
  }

  render() {

    return (
      <Row>
        <Col span={18} onClick={() => this.addDancer(this.props.id)}>
          {this.props.id + 1}. {this.props.name}
        </Col>
        <Col span={6}>
          {this.props.editable && <Icon type="minus" theme="outlined" onClick={() => this.removeDancer(this.props.id)}/>}
        </Col>
      </Row>
    );
  }
}

export default PerformerItem;