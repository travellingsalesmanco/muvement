import React from 'react';
import { Row, Col, Icon, Button } from "antd";
import { removeDancer, addDancer } from "../actions/danceActions"
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
      editPerformers: false,
      toRemove: []
    })
  };

  handleRemoval = () => {
    // TODO: make bulk action
    this.state.toRemove.map((dancer) => {
      console.log("Remove dancer: " + dancer);
      this.props.dispatch(removeDancer(this.props.danceId, dancer));
    });
    this.handleCancelAction();
    return true;
  };

  handleAddition = (nameArr) => {
    // TODO: make bulk action
    nameArr.map((dancer) => {
      console.log("Add dancer: " + dancer);
      this.props.dispatch(addDancer(this.props.danceId, dancer))
    });
    return true;
  };

  markDancerForRemoval(name) {
    this.setState({
      toRemove: [...this.state.toRemove, name]
    })
  }

  addDancerToFrame(name) {
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
          if (this.state.toRemove.includes(dancer)) {
            return null;
          }
          return (
            <Row key={key}>
              <Col span={18} onClick={() => this.addDancerToFrame(dancer)}>
                <span id="dancer-item" style={this.isActiveDancerStyle(dancer)}>{key + 1}. {dancer}</span>
              </Col>
              <Col span={6}>
                {this.state.editPerformers &&
                <Icon type="minus" theme="outlined" onClick={() => this.markDancerForRemoval(dancer)} />}
              </Col>
            </Row>)
        })}
        {!this.state.editPerformers &&
        <AddPerformerForm nextId={this.props.dancers.length + 1}
                          handleSetAdd={this.handleSetAdd.bind(this)}
                          handleCancelAction={this.handleCancelAction.bind(this)}
                          handleAddition={this.handleAddition.bind(this)}
        />
        }
        {!this.state.addPerformer && !this.state.editPerformers &&
        <Button type={"default"} icon="edit" ghost block onClick={this.handleSetToggle}>Edit Performers</Button>
        }
        {this.state.editPerformers && (
          <div>
            <Button type={"default"} block onClick={this.handleRemoval}>APPLY</Button>
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
