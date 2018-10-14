import React from 'react';
import { Row, Col, Icon, Button } from "antd";
import { removeDancer } from "../actions/danceActions"
import { addDancerToFrame } from "../actions/frameActions"
import { connect } from 'react-redux';
import './PerformerList.css';
import AddPerformerForm from "./AddPerformerForm";

class PerformerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editPerformers: false,
      addPerformer: false,
      toRemove: [],
      toAdd: ""
    };
  }

  handleSetToggle = () => {
    this.setState({
      editPerformers: true,
      addPerformer: false
    })
  };

  handleSetAdd = () => {
    this.setState({
      addPerformer: true,
      editPerformers: false
    })
  };

  handleCancelAction = () => {
    this.setState({
      addPerformer: false,
      editPerformers: false
    })
  };

  removeDancer(name) {
    console.log("Remove dancer: " + name);
    this.props.dispatch(removeDancer(this.props.danceId, name));
  }

  addDancer(name) {
    // TODO: Add dancer through redux (mechanism to be decided)
    console.log("Add dancer to stage: " + name);
  }

  addDancerToFrame(name) {
    // TODO: Add dancer to frame through redux on click of name
    if (!this.props.activeDancers.includes(name)) {
      console.log("Add dancer to frame: " + name);
      this.props.dispatch(addDancerToFrame(this.props.danceId, this.props.frameId, name));
    } else {
      console.log("Dancer already on frame");
    }
  }

  // TODO : move this to proper css
  isActiveDancerStyle(name) {
    if (this.props.activeDancers.includes(name)) {
      return { color: '#24c6dc' }
    } else {
      return { color: 'white' }
    }
  }

  render() {
    return (
      <div id="performer-list">
        {this.props.dancers.map((dancer, key) => {
          return (
            <Row key={key}>
              <Col span={18} onClick={() => this.addDancerToFrame(dancer)}>
                <span id="dancer-item" style={this.isActiveDancerStyle(dancer)}>{key + 1}. {dancer}</span>
              </Col>
              <Col span={6}>
                {this.state.editPerformers &&
                <Icon type="minus" theme="outlined" onClick={() => this.removeDancer(dancer)} />}
              </Col>
            </Row>)
        })}
        {!this.state.editPerformers &&
        <AddPerformerForm nextId={this.props.dancers.length} signalAdd={this.handleSetAdd.bind(this)} signalCancel={this.handleCancelAction.bind(this)} />
        }
        {!this.state.addPerformer && !this.state.editPerformers &&
        <Button type={"default"} icon="edit" ghost block onClick={this.handleSetToggle}>Edit Performers</Button>
        }
        {this.state.editPerformers && (
          <div>
            <Button type={"default"} block onClick={this.handleCancelAction}>APPLY</Button>
            <Button type={"default"} block onClick={this.handleCancelAction}>CANCEL</Button>
          </div>
        )}
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
