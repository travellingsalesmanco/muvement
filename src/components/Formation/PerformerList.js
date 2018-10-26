import React from 'react';
import { Row, Col, Icon, Button } from "antd";
import { addDancerToFormation, removeDancerFromFormation } from "../../actions/formationActions"
import { connect } from 'react-redux';
import './PerformerList.css';
import { getChoreo } from '../../selectors/choreo';

class PerformerList extends React.Component {

  addDancerToFormation(name) {
    if (!this.props.activeDancers.includes(name)) {
      console.log("Add dancer to formation: " + name);
      this.props.dispatch(addDancerToFormation(this.props.choreoId, this.props.formationId, name));
    } else {
      console.log("Dancer already on formation");
    }
  }

  removeDancerFromFormation(name) {
    if (this.props.activeDancers.includes(name)) {
      console.log("Remove dancer from formation: " + name);
      this.props.dispatch(removeDancerFromFormation(this.props.choreoId, this.props.formationId, name));
    } else {
      console.log("Dancer already off formation");
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
              onClick={() => this.removeDancerFromFormation(dancer)}
            />
          } else {
            actionIcon = <Icon
              style={this.isActiveDancerStyle(dancer)}
              type="plus"
              theme="outlined"
              onClick={() => this.addDancerToFormation(dancer)}
            />
          }
          return (
            <Row key={dancer}>
              <Col span={21}>
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

const mapStateToProps = (state, props) => {
  const choreo = getChoreo(state, props.choreoId)
  return {
    dancers: choreo.dancers,
    activeDancers: choreo.formations[state.UI.activeFormation].dancers.map((dancer) => {
      return dancer.name;
    }),
    formationId: state.UI.activeFormation
  }
};

export default connect(mapStateToProps)(PerformerList);
