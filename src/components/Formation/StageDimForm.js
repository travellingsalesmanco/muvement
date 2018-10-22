import { InputNumber } from "antd";
import React from 'react';
import { editStageDimensions } from "../../actions/choreoActions"
import { connect } from 'react-redux'
import './StageDimForm.css';
import { getChoreo } from "../../selectors/choreo";

class StageDimForm extends React.Component {

  handleWidthChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.choreoId, {
        width: value
      }));
    }
  };

  handleHeightChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.choreoId, {
        height: value
      }));
    }
  };

  handleGridSizeChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.choreoId, {
        gridSize: value
      }));
    }
  };

  render() {
    return (
      <div id="stage-dim">
        <h3>Height ({this.props.units})</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.height} onChange={this.handleHeightChange} />
        <h3>Width ({this.props.units})</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.width} onChange={this.handleWidthChange} />
        <h3>Grid Size ({this.props.units})</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.gridSize} onChange={this.handleGridSizeChange} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const choreo = getChoreo(state, props.choreoId)
  return {
    height: choreo.stageDim.height,
    width: choreo.stageDim.width,
    gridSize: choreo.stageDim.gridSize,
    units: choreo.stageDim.units,
  }
};

export default connect(mapStateToProps)(StageDimForm);
