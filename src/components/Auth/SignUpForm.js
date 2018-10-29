import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import * as auth from "../../firebase/auth";


const FormItem = Form.Item;

const ACCOUNT_EXISTS_CODE = "auth/email-already-in-use";
const ACCOUNT_EXISTS_MESSAGE = "Account under email already exists!";
const WEAK_PASSWORD_CODE = "auth/weak-password";
const WEAK_PASSWORD_MESSAGE = "Password is too weak!";
const INVALID_EMAIL_CODE = "auth/invalid-email";
const INVALID_EMAIL_MESSAGE = "Email is invalid!";
class SignUpForm extends React.Component {
  state = {
    loading: false,
    disabled: false
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
        loading: true,
        disabled: true,
      }, () =>
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            auth.doSignUpWithEmailAndPassword(values.username, values.email, values.password).then(
              () => this.props.history.push(`/`)
            ).catch((err) => {
              console.log(err);
              let errMessage = "Could not log in";
              switch (err.code) {
                case WEAK_PASSWORD_CODE: {
                  errMessage = WEAK_PASSWORD_MESSAGE;
                  break;
                }
                case ACCOUNT_EXISTS_CODE: {
                  errMessage = ACCOUNT_EXISTS_MESSAGE;
                  break;
                }
                case INVALID_EMAIL_CODE: {
                  errMessage = INVALID_EMAIL_MESSAGE;
                  break;
                }
              }
              this.setState({
                  loading: false,
                  disabled: false,
                }, () => {
                  this.props.form.setFields({
                    submit: {
                      errors: [new Error(errMessage)],
                    }
                  });
                }
              );
            });
          }
        })
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, disabled } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your name!' }],
          })(
            <Input prefix={<Icon type="user" />} placeholder="Name" />
          )}
        </FormItem>
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
          <Button type="primary" htmlType="submit"
                  className="auth-signup-button"
                  loading={loading}
                  disabled={disabled}
          >
            SIGN UP
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default withRouter((Form.create())(SignUpForm));
