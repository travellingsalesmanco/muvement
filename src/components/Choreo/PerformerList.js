import React, { Fragment } from 'react';
import { Row, Col, Icon, Button } from "antd";
import { removeDancers, addDancers } from "../../actions/danceActions"
import { connect } from 'react-redux';
import AddPerformerForm from "./AddPerformerForm";
import { getDance } from "../../selectors/dance";

class PerformerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      removePerformers: false,
      addPerformer: false,
      toRemove: [],
    };
  }

  handleRemoveToggle = () => {
    this.setState({
      removePerformers: true,
      addPerformer: false
    })
  };

  handleSetAdd = () => {
    this.setState({
      addPerformer: true,
      removePerformers: false
    })
  };

  handleCancelAction = () => {
    this.setState({
      addPerformer: false,
      removePerformers: false,
      toRemove: []
    })
  };

  handleRemoval = () => {
    this.props.dispatch(removeDancers(this.props.danceId, this.state.toRemove));
    this.handleCancelAction();
  };

  handleAddition = (nameArr) => {
    this.props.dispatch(addDancers(this.props.danceId, nameArr));
  };

  markDancerForRemoval(name) {
    this.setState({
      toRemove: [...this.state.toRemove, name]
    })
  }

  render() {
    let performerListDisplay;
    if (this.state.removePerformers) {
      // Removal state
      performerListDisplay =
        <Fragment>
          {this.props.dancers.map((dancer, key) => {
            if (this.state.toRemove.includes(dancer)) {
              return null;
            }
            return (
              <Row key={key}>
                <Col span={18} onClick={() => this.addDancerToFrame(dancer)}>
                  <span id="dancer-item">{key + 1}. {dancer}</span>
                </Col>
                <Col span={6}>
                  <Icon type="minus" theme="outlined" onClick={() => this.markDancerForRemoval(dancer)} />
                </Col>
              </Row>)
          })}
          <Button type={"default"} block onClick={this.handleRemoval}>APPLY</Button>
          <Button type={"default"} block onClick={this.handleCancelAction}>CANCEL</Button>
        </Fragment>
    } else {
      // Default or add performer state
      performerListDisplay =
        <Fragment>
          {this.props.dancers.map((dancer, key) => {
            if (this.state.toRemove.includes(dancer)) {
              return null;
            }
            return (
              <Row key={key}>
                <Col span={18}>
                  <span id="dancer-item">{key + 1}. {dancer}</span>
                </Col>
              </Row>)
          })}
          <AddPerformerForm
            nextId={this.props.dancers.length + 1}
            handleSetAdd={this.handleSetAdd.bind(this)}
            handleCancelAction={this.handleCancelAction.bind(this)}
            handleAddition={this.handleAddition.bind(this)}
          />
          {!this.state.addPerformer &&
          <Button type={"default"} icon="user-delete" ghost block
                  onClick={this.handleRemoveToggle}>Edit Performers</Button>
          }
        </Fragment>
    }
    return (
      <div id="performer-list">
        {performerListDisplay}
      </div>
    );
  }
}

const mapStateToProps = function (state, props) {
  const dance = getDance(state, props.danceId);
  return {
    dancers: dance.dancers,
  }
};

export default connect(mapStateToProps)(PerformerList);