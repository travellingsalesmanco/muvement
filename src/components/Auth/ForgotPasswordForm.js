import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import './Auth.css';
import { auth } from "../../firebase";

const FormItem = Form.Item;

class ForgotPasswordForm extends React.Component {
  state = {
    loading: false,
    disabled: false,
    sent: false,
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
        auth.doPasswordReset(values.email)
        this.setState({
          loading: false,
          disabled: false,
          sent: true
        })
      }
    }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { disabled, loading, sent } = this.state;
    return (
      sent
        ? <span className={"auth-text"}>You should receive an email if you are registered.</span>
        : <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, type: 'email', message: 'Please input your email!' }],
            })(
              <Input className="auth-input" prefix={<Icon type="mail" />} placeholder="Email" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="auth-signup-button"
                    loading={loading}
                    disabled={disabled}
            >
              SEND EMAIL
            </Button>
          </FormItem>
        </Form>
    )
      ;
  }
}

export default (Form.create())(ForgotPasswordForm);
