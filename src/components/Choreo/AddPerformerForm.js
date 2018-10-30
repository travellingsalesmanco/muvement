import { Form, Input, Icon, Button } from 'antd';
import React from 'react';
import './AddPerformerForm.css';

const FormItem = Form.Item;

class AddPerformerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextKey: 0,
    }
  }


  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // We need at least one performer to add
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.state.nextKey);
    // Notify parent that adding is beginning
    if (this.state.nextKey === 0) {
      this.props.handleSetAdd();
    }
    this.setState({
      nextKey: this.state.nextKey + 1
    });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  clearAll = () => {
    const { form } = this.props;
    // Notify parent that adding is cancelled
    this.props.handleCancelAction();
    form.setFieldsValue({
      keys: []
    });
    this.setState({
      nextKey: 0
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.handleAddition(values.names);
        this.clearAll();
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { nextId } = this.props;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          className="performer-input-item"
          label={index + nextId}
          required={false}
          key={k}
          labelCol={{
            span: 2
          }}
          wrapperCol={{
            span: 20
          }}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input performer's name or delete this field.",
            }],
          })(
            <Input className={"performer-input"} placeholder="Enter name" />
          )}
          {keys.length > 1 ? (
            <Icon
              className="cancel-performer"
              type="minus"
              theme="outlined"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <Form
        layout={"horizontal"}
        onSubmit={this.handleSubmit}
      >
        {formItems}
        <Button className="add-performer-button" type={"default"} icon="user-add" ghost block onClick={this.add}>Add
          Performer</Button>
        {this.state.nextKey > 0 && (
          <div>
            <FormItem className="form-item">
              <Button className="add-performer-button" type={"default"} htmlType="submit" block>DONE</Button>
            </FormItem>
            <Button type={"default"} block onClick={this.clearAll}>CANCEL</Button>
          </div>
        )
        }
      </Form>
    );
  }
}

export default (Form.create())(AddPerformerForm);
