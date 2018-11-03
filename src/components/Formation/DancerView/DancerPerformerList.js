import React from 'react';
import { Row, Col, Icon, Switch } from "antd";
import { connect } from 'react-redux';
import './DancerPerformerList.css';
import { getChoreo } from '../../../selectors/choreo';
import { DESELECT_DANCER, SELECT_DANCER } from "../../../constants/actionTypes";

class DancerPerformerList extends React.Component {


  handleDancerSelectionChange(name, checked) {
    if (checked) {
      this.props.dispatch({ type: SELECT_DANCER, payload: name })
    } else {
      this.props.dispatch({ type: DESELECT_DANCER, payload: name })
    }
  }

  // TODO : move this to proper css
  isSelectedDancerStyle(name) {
    if (this.props.selectedDancers.includes(name)) {
      return { color: '#24c6dc' }
    } else {
      return { color: 'white' }
    }
  }

  isSelectedDancer(name) {
    return this.props.selectedDancers.includes(name);
  }

  // TODO: Implement edit button modal
  render() {
    return (
      <div id="dancer-performer-list">
        {this.props.dancers.map((dancer, key) => {
          return (
            <Row key={dancer}>
              <Col span={21}>
                <span id="dancer-list-item" style={this.isSelectedDancerStyle(dancer)}>{key + 1}. {dancer}</span>
              </Col>
              <Col span={3}>
                <Switch checked={this.isSelectedDancer(dancer)}
                        onChange={(checked) => this.handleDancerSelectionChange(dancer, checked)} />
              </Col>
            </Row>
          )
        })}

      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const choreo = getChoreo(state, props.choreoId);
  return {
    dancers: choreo.dancers,
    selectedDancers: state.UI.selectedDancers,
    formationId: state.UI.activeFormation
  }
};

export default connect(mapStateToProps)(DancerPerformerList);
