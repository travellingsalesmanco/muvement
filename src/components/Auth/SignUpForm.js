import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import { auth, firebaseConstants } from "../../firebase";


const FormItem = Form.Item;

const EMAIL_EXISTS_MESSAGE = "Account under this email already exists!";
const WEAK_PASSWORD_MESSAGE = "Password is too weak!";
const INVALID_EMAIL_MESSAGE = "Email is invalid!";
const FACEBOOK_PROVIDER_MESSAGE = "You are registered through Facebook. Please sign in through that instead.";
const GOOGLE_PROVIDER_MESSAGE = "You are registered through Google. Please sign in through that instead.";

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
      }, () => this.props.form.validateFields((err, values) => {
        if (err) {
          this.setState({
            loading: false,
            disabled: false,
          })
        } else {
          console.log('Received values of form: ', values);
          auth.doSignUpWithEmailAndPassword(values.username, values.email, values.password).then(
            () => this.props.history.push(`/`)
          ).catch((err) => {
            console.log(err);
            let errMessage = "Could not sign up";
            switch (err.code) {
              case firebaseConstants.EMAIL_SIGN_UP.WEAK_PASSWORD_CODE: {
                errMessage = WEAK_PASSWORD_MESSAGE;
                break;
              }
              case firebaseConstants.EMAIL_SIGN_UP.EMAIL_EXISTS_CODE: {
                errMessage = EMAIL_EXISTS_MESSAGE;
                break;
              }
              case firebaseConstants.EMAIL_SIGN_UP.INVALID_EMAIL_CODE: {
                errMessage = INVALID_EMAIL_MESSAGE;
                break;
              }
              case firebaseConstants.EMAIL_SIGN_UP.DIFFERENT_PROVIDER_CODE: {
                if (err.method === firebaseConstants.FACEBOOK_SIGN_IN_METHOD) {
                  errMessage = FACEBOOK_PROVIDER_MESSAGE;
                } else if (err.method === firebaseConstants.GOOGLE_SIGN_IN_METHOD) {
                  errMessage = GOOGLE_PROVIDER_MESSAGE;
                }
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
          {getFieldDecorator('submit', {})(
            <Button type="primary" htmlType="submit"
                    className="auth-signup-button"
                    loading={loading}
                    disabled={disabled}
            >
              SIGN UP
            </Button>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default withRouter((Form.create())(SignUpForm));
