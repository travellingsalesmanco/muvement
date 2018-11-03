import React, { Fragment } from 'react';
import { Row, Col, Icon, Button } from "antd";
import { removeDancers, addDancers } from "../../actions/choreoActions"
import { TabletPortrait } from "../ResponsiveUtils/BreakPoint";
import { connect } from 'react-redux';
import AddPerformerForm from "./AddPerformerForm";
import { getChoreo } from "../../selectors/choreo";
import './PerformerList.css';

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
    this.props.dispatch(removeDancers(this.props.choreoId, this.state.toRemove));
    this.handleCancelAction();
  };

  handleAddition = (nameArr) => {
    this.props.dispatch(addDancers(this.props.choreoId, nameArr));
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
                <Col span={18}>
                  <span className="dancer-item">{key + 1}. {dancer}</span>
                </Col>
                <Col span={6}>
                  <Icon style={{color: '#24C6DC'}}
                        type="minus" theme="outlined" onClick={() => this.markDancerForRemoval(dancer)} />
                </Col>
              </Row>)
          })}
          <Button className="add-performer-button" type={"default"} icon="user-add" ghost block onClick={this.add}>Add
            Performer</Button>
          <Button type={"default"} block onClick={this.handleRemoval}>DONE</Button>
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
                <Col className="dancer" span={18}>
                  <span className="dancer-item">{key + 1}. {dancer}</span>
                </Col>
              </Row>)
          })}
          <div className="add-performer-form">
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
          </div>
        </Fragment>
    }
    return (
      <div className="performer-list">
        {performerListDisplay}
      </div>
    );
  }
}

const mapStateToProps = function (state, props) {
  const choreo = getChoreo(state, props.choreoId);
  return {
    dancers: choreo.dancers,
  }
};

export default connect(mapStateToProps)(PerformerList);
