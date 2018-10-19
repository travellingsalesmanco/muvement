import { InputNumber } from "antd";
import React from 'react';
import { editStageDimensions } from "../../actions/danceActions"
import { connect } from 'react-redux'
import './StageDimForm.css';

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
        <h3>Height</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.height} onChange={this.handleHeightChange}/>
        <h3>Width</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.width} onChange={this.handleWidthChange}/>
        <h3>Grid Size</h3>
        <InputNumber min={0.50} precision={2} defaultValue={this.props.gridSize} onChange={this.handleGridSizeChange}/>
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    height: state.dances[state.UI.activeDance].stageDim.height,
    width: state.dances[state.UI.activeDance].stageDim.width,
    gridSize: state.dances[state.UI.activeDance].stageDim.gridSize,
    danceId: state.UI.activeDance
  }
};

export default connect(mapStateToProps)(StageDimForm);
