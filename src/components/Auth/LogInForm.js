import { Form, Input, Icon, Button, Checkbox } from 'antd';
import React from 'react';
import './Auth.css';
import Link from "react-router-dom/es/Link";

const FormItem = Form.Item;

class LogInForm extends React.Component {

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
            <Input prefix={<Icon type="mail" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }],
          })(
            <Input prefix={<Icon type="lock" />} type="password"
                   placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <div>
            <Link className="form-link" to={`/forgotpassword`}>Forgot your password?</Link>
          </div>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox><span className="form-text">Remember me</span></Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button">
            LOG IN
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default (Form.create())(LogInForm);