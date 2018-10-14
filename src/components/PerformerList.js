import React from 'react';
import {Row, Col, Icon, Button} from "antd";
import {removeDancer} from "../actions/danceActions"
import {connect} from 'react-redux';

class PerformerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editPerformers: false
    };
  }

  handleEditToggle = () => {
    this.setState({
      editPerformers: !this.state.editPerformers
    })
  };

  removeDancer(name) {
    console.log("Remove dancer: " + name);
    console.log(this.props);
    this.props.dispatch(removeDancer(this.props.danceId, name));
  }

  addDancer(name) {
    // TODO: Add dancer through redux on click of name
    console.log("Add dancer to stage: " + name);
  }

  render() {
    return (
      <div>
        {this.props.dancers.map((dancer, key) => {
          return (
            <Row key={key}>
              <Col span={18} onClick={() => this.addDancer(dancer)}>
                {key + 1}. {dancer}
              </Col>
              <Col span={6}>
                {this.state.editPerformers &&
                <Icon type="minus" theme="outlined" onClick={() => this.removeDancer(dancer)}/>}
              </Col>
            </Row>)
        })}
        <Button type={"dashed"} icon="user-add" ghost block>Add Performer</Button>
        <Button type={"dashed"} icon="tool" ghost block onClick={this.handleEditToggle}>Edit Performers</Button>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  console.log(state);
  return {
    dancers: state.dances[state.UI.activeDance].dancers,
    activeDancers: state.dances[state.UI.activeDance].frames[state.UI.activeFrame].dancers.map((dancer) => {
      return dancer.name;
    }),
    danceId: state.UI.activeDance,
    frameId: state.UI.activeFrame
  }
};

export default connect(mapStateToProps)(PerformerList);