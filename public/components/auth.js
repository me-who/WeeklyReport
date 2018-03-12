import React from 'react';
import { message } from 'antd';

export default class Auth extends React.Component {
  constructor(props){
    super(props);
    this.isLogin = false;
  }

  // 用户登录函数
  login(password, check_pass, callback){
    if (password == check_pass){
      this.isLogin = true;
      window.isLogin = this.isLogin;
      callback(); //登录成功，调用回调函数
    }else {
      message.error('账号或密码输入错误!');
    }
  }
}