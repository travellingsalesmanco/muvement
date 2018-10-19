import React from 'react';
import { Row, Col, Icon, Button } from "antd";
import { addDancerToFrame, removeDancerFromFrame } from "../../actions/frameActions"
import { connect } from 'react-redux';
import './PerformerList.css';

class PerformerList extends React.Component {

  addDancerToFrame(name) {
    if (!this.props.activeDancers.includes(name)) {
      console.log("Add dancer to frame: " + name);
      this.props.dispatch(addDancerToFrame(this.props.danceId, this.props.frameId, name));
    } else {
      console.log("Dancer already on frame");
    }
  }

  removeDancerFromFrame(name) {
    if (this.props.activeDancers.includes(name)) {
      console.log("Remove dancer from frame: " + name);
      this.props.dispatch(removeDancerFromFrame(this.props.danceId, this.props.frameId, name));
    } else {
      console.log("Dancer already off frame");
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

  isActiveDancer(name) {
    return this.props.activeDancers.includes(name);
  }

  // TODO: Implement edit button modal
  render() {
    return (
      <div id="performer-list">
        {this.props.dancers.map((dancer, key) => {
          let actionIcon;
          if (this.isActiveDancer(dancer)) {
            actionIcon = <Icon
              style={this.isActiveDancerStyle(dancer)}
              type="minus"
              theme="outlined"
              onClick={() => this.removeDancerFromFrame(dancer)}
            />
          } else {
            actionIcon = <Icon
              style={this.isActiveDancerStyle(dancer)}
              type="plus"
              theme="outlined"
              onClick={() => this.addDancerToFrame(dancer)}
            />
          }
          return (
            <Row key={dancer}>
              <Col span={18}>
                <span id="dancer-item" style={this.isActiveDancerStyle(dancer)}>{key + 1}. {dancer}</span>
              </Col>
              <Col span={3}>
                {actionIcon}
              </Col>
            </Row>)
        })}
        
      </div>
    )
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
