import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import './Auth.css';

const FormItem = Form.Item;

class ForgotPasswordForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input className="auth-input" prefix={<Icon type="mail" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="auth-signup-button">
            SEND EMAIL
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default (Form.create())(ForgotPasswordForm);
