import React from 'react';
import $ from 'jquery';
import Header from './header';
import { md5 } from 'md5js';
import { Form, Input, Button, message } from 'antd';
const FormItem = Form.Item;

class PwdModified extends React.Component {
  state = {
    confirmDirty: false
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['password_confirm'], { force: true });
    }
    callback();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.new_password = md5(values.new_password);
        $.ajax({
          url: '/users/queryById',
          type: 'GET',
          data: values,
          success: data => {
            // console.log(data);
            if(data != '' && md5(values.password) == data[0].password) {
              $.ajax({
                url: '/users/updatePass',
                type: 'GET',
                data: values,
                success: data => {
                  message.success('密码修改成功！', 2);
                  window.isLogin = false;
                  this.props.history.push('/');
                },
                error: error => {
                  console.log(error);
                }
              });
            }else {
              message.error('账号或密码输入错误', 2);
            }
          },
          error: error => {
            console.log(error);
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4, offset: 5 },
      wrapperCol: { span: 6 },
    };
    const tailFormItemLayout  = {
      wrapperCol: { span: 6, offset: 9 }
    };
    return(
      <div>
        <Header />
        <div className="modify_form">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: 'Please input your username',
                }]
              })(
                <Input />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: 'Please input your password',
                }]
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="修改密码">
              {getFieldDecorator('new_password', {
                rules: [{
                  required: true,
                  message: 'Please input your new password',
                }, {
                  validator: this.checkConfirm
                }]
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="再次输入修改密码" >
              {getFieldDecorator('password_confirm', {
                rules: [{
                  required: true,
                  message: 'Please confirm your password',
                }, {
                  validator: this.checkPassword
                }]
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                确认修改
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
const PwdModify = Form.create()(PwdModified);

export default PwdModify;

