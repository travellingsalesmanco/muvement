import { InputNumber } from "antd";
import React from 'react';
import { editStageDimensions } from "../../actions/danceActions"
import { connect } from 'react-redux'
import './StageDimForm.css';
import { getDance } from "../../selectors/dance";

class StageDimForm extends React.Component {

  handleWidthChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.danceId, {
        width: value
      }));
    }
  };

  handleHeightChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.danceId, {
        height: value
      }));
    }
  };

  handleGridSizeChange = value => {
    if (value >= 0) {
      this.props.dispatch(editStageDimensions(this.props.danceId, {
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
  const dance = getDance(state, props.danceId)
  return {
    height: dance.stageDim.height,
    width: dance.stageDim.width,
    gridSize: dance.stageDim.gridSize,
    units: dance.stageDim.units,
  }
};

export default connect(mapStateToProps)(StageDimForm);
