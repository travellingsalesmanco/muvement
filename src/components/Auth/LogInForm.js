import { Form, Input, Icon, Button, Checkbox } from 'antd';
import React from 'react';
import './Auth.css';
import Link from "react-router-dom/es/Link";
import { withRouter } from "react-router-dom";
import { auth } from "../../firebase";

const FormItem = Form.Item;
const NO_USER_FOUND_CODE = "auth/user-not-found";
const NO_USER_FOUND_MESSAGE = "No such user found!";
const WRONG_PASSWORD_CODE = "auth/wrong-password";
const WRONG_PASSWORD_MESSAGE = "Incorrect password!";


class LogInForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        auth.doSignInWithEmailAndPassword(values.email, values.password).then(
          () => this.props.history.push(`/`)
        ).catch((err) => {
          console.log(err);
          let errMessage = "Could not log in";
          switch (err.code) {
            case NO_USER_FOUND_CODE: {
              errMessage = NO_USER_FOUND_MESSAGE;
              break;
            }
            case WRONG_PASSWORD_CODE: {
              errMessage = WRONG_PASSWORD_MESSAGE;
              break;
            }
          }

          this.props.form.setFields({
            submit: {
              errors: [new Error(errMessage)],
            }
          });
          }
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
          })(
            <Input className="auth-input" prefix={<Icon type="mail" />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }],
          })(
            <Input className="auth-input" prefix={<Icon type="lock" />} type="password"
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
        </FormItem>
        <FormItem>
          {getFieldDecorator('submit', {
          })(
          <Button type="primary" htmlType="submit" className="auth-signup-button">
            LOG IN
          </Button>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default withRouter((Form.create())(LogInForm));
