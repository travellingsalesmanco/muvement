import {Button, Form, InputNumber} from "antd";
import React from 'react';
import {editStageDimensions} from "../actions/danceActions"
import {connect} from 'react-redux'
import './StageDimForm.css';

class StageDimForm extends React.Component {
  handleDimChange = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch(editStageDimensions(this.props.danceId, {
          width: values.stageWidth,
          height: values.stageHeight,
          gridSize: values.gridSize
        }));
      } else {
        console.log('Error: ', err);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="stage-dim">
        <Form layout={"vertical"} onSubmit={this.handleDimChange}>
          <Form.Item label={'Height'}>
            {getFieldDecorator('stageHeight', {
              initialValue: this.props.height
            })(
              <InputNumber min={0.01} precision={2}/>
            )}
          </Form.Item>
          <Form.Item label={'Width'}>
            {getFieldDecorator('stageWidth', {
              initialValue: this.props.width
            })(
              <InputNumber min={0.01} precision={2}/>
            )}
          </Form.Item>
          <Form.Item label={'Grid Size'}>
            {getFieldDecorator('gridSize', {
              initialValue: this.props.gridSize
            })(
              <InputNumber min={0.01} precision={2}/>
            )}
          </Form.Item>
          <Form.Item>
            <Button type={"default"} htmlType={'submit'} block>APPLY</Button>
          </Form.Item>
        </Form>
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

export default connect(mapStateToProps)(Form.create()(StageDimForm));

