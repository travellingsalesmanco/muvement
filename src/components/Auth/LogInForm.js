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
const INVALID_EMAIL_CODE = "auth/invalid-email";
const INVALID_EMAIL_MESSAGE = "Email is invalid!";
const USER_DISABLED_CODE = "auth/user-disabled";
const USER_DISABLED_MESSAGE = "Your account is disabled, please contact support.";


class LogInForm extends React.Component {
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
                case INVALID_EMAIL_CODE: {
                  errMessage = INVALID_EMAIL_MESSAGE;
                  break;
                }
                case USER_DISABLED_CODE: {
                  errMessage = USER_DISABLED_MESSAGE;
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
            })
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
          {getFieldDecorator('submit', {})(
            <Button type="primary" htmlType="submit"
                    className="auth-signup-button"
                    loading={loading}
                    disabled={disabled}
            >
              LOG IN
            </Button>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default withRouter((Form.create())(LogInForm));
