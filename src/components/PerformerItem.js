import React from 'react';
import {Row, Col, Icon} from "antd";

class PerformerItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: Remove dancer through redux on click of icon
    return (
      <Row>
        <Col span={3}>{this.props.id}.</Col>
        <Col span={15}>{this.props.name}</Col>
        <Col span={6}>
          {this.props.editable && <Icon type="minus" theme="outlined"/>}
        </Col>
      </Row>
    );
  }
}

export default PerformerItem;