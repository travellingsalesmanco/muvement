import {Button, Form, InputNumber} from "antd";
import React from 'react';

class StageDimForm extends React.Component {
  // TODO: update redux via action
  handleDimChange = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      } else {
        console.log('Error: ', err);
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout={"vertical"} onSubmit={this.handleDimChange}>
        <Form.Item label={'Height'}>
          {getFieldDecorator('stageHeight', {
            initialValue: this.props.height
          })(
            <InputNumber min={0.01} precision={2}/>
          )}
        </Form.Item>
        < Form.Item label={'Width'}>
          {getFieldDecorator('stageWidth', {
            initialValue: this.props.width
          })(
            <InputNumber min={0.01} precision={2}/>
          )}
        </Form.Item>
        <Form.Item>
          <Button type={"dashed"} htmlType={'submit'} ghost block>Apply</Button>
        </Form.Item>
      </Form>
    );
  }
}


export default Form.create()(StageDimForm);

