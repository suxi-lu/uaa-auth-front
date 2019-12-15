import { Form, Input, Modal } from "antd";

import { FormComponentProps } from "antd/es/form";
import { TableUaaUserItem } from "@/pages/uaa/user/data";

import React, { Component } from "react";

const FormItem = Form.Item;

interface UaaUserFormProps extends FormComponentProps {
  values: Partial<TableUaaUserItem>;
  modalVisible: boolean;
  onSubmit: (values: Partial<TableUaaUserItem>) => void;
  onCancel: (values: Partial<TableUaaUserItem>) => void;
}

interface UaaUserFormState {
  formValues: Partial<TableUaaUserItem>;
}

class UaaUserForm extends Component<UaaUserFormProps, UaaUserFormState> {
  static defaultProps = {
    onSubmit: () => {},
    modalVisible: false,
    values: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  constructor(props: UaaUserFormProps) {
    super(props);

    this.state = {
      formValues: props.values
    };
  }

  render() {
    const { modalVisible, values, form, onSubmit, onCancel } = this.props;
    const okHandle = () => {
      form.validateFields(err => {
        if (err) return;
        form.resetFields();
        onSubmit(this.state.formValues);
      });
    };
    return (
      <Modal
        destroyOnClose
        title="编辑用户"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => onCancel(values)}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="登录名"
        >
          {form.getFieldDecorator("loginName", {
            rules: []
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {form.getFieldDecorator("password", {
            rules: []
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<UaaUserFormProps>()(UaaUserForm);
