import React from 'react';
import $ from 'jquery';
import { md5 } from 'md5js';
import Header from './header';
import { Layout, Col, Row, Form, Input, Icon, Button, message } from 'antd';
const FormItem = Form.Item;
import '../stylesheets/main.css';
import Auth from './auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(md5(values.password));
        // console.log('Received values of form: ', values);
        $.ajax({
          url: '/users/queryById',
          type: 'GET',
          data: values,
          success: data => {
            if(data != '') {
              let auth = this.props.auth==null ? new new Auth() : this.props.auth;
              auth.login( md5(values.password), data[0].password, ()=>{
                message.success('登录成功', 2);
                if(data[0].auth == 'admin'){
                  window.name = 'Admin';
                  this.props.history.push('/admin');
                }else {
                  window.key = data[0].key;
                  window.username = data[0].username;
                  window.position = data[0].position;
                  window.field = data[0].field;
                  window.name = data[0].name;
                  window.field = data[0].field;
                  let path = `/user/${values.username}`;
                  this.props.history.push(path);
                }
              });
            }
            else {
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
    return(
      <div>
        <Header />
        <div className="login-content">
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <FormItem label="账号" labelCol={{ span: 4, offset: 5 }} wrapperCol={{ span: 6 }}>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="username"></Input>
              )}
            </FormItem>
            <FormItem label="密码" labelCol={{ span: 4, offset: 5 }} wrapperCol={{ span: 6 }}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!', whitespace: true }],
              })(
                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem wrapperCol={{ span: 6, offset: 9 }}>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);
export default LoginForm;