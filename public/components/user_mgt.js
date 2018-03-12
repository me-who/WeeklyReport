import React from 'react';
import $ from 'jquery';
import { md5 } from 'md5js';
import { Form, Input, Button, Table, Modal, message, Select, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class UserMGTs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: []
    };
  }
  componentDidMount() {
    $.ajax({
      url: '/users/queryAll',
      type: 'GET',
      success: data => {
        console.log(data);
        this.setState({
          info: data
        });
      }
    });
  }

  onDelete = (key) => {
    const dataSource = [...this.state.info];
    console.log(dataSource.filter(item => item.key === key));
    $.ajax({
      url: '/users/deleteUser',
      type: 'GET',
      data: {
        data: dataSource.filter(item => item.key === key)
      },
      success: data => {
        this.setState({ info: dataSource.filter(item => item.key !== key) });
        message.success('用户删除成功!');
      },
      error: error => {
        console.log(error);
      }
    });
  }

  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log(values);
        const { info } = this.state;
        info.push({
          key: values.username,
          name: values.name,
          username: values.username,
          password: md5(values.password),
          position: values.position,
          field: values.field,
          auth: 'user'
        });
        values.auth = 'user';
        values.password = md5(values.password);
        $.ajax({
          type: 'GET',
          url: '/users/addUser',
          data: values,
          success: data => {
            message.success('用户添加成功');
            $.ajax({
              url: '/users/queryAll',
              type: 'GET',
              success: data => {
                this.setState({
                  info: data,
                  visible: false
                });
              },
              error: error => {
                console.log(error);
              }
            });
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        message.info('请输入新用户信息!');
      }
    });
    this.props.form.resetFields();
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleAdd = () => {
    this.setState({
      visible: true
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: '1'
    }, {
      title: '账号',
      dataIndex: 'username',
      key: '2'
    }, {
      title: '职位',
      dataIndex: 'position',
      key: '4'
    }, {
      title: '领域',
      dataIndex: 'field',
      key: '5'
    }, {
      title: '权限',
      dataIndex: 'auth',
      key: '6'
    }, {
      title: '删除用户',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.info.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                <a href="#">Delete</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
    return(
      <div>
        <Button style={{ margin: '10px 0' }} type="primary" className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Table dataSource={this.state.info} columns={columns} />
        <Modal visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入新用户姓名!' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="账号">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入新用户账号!' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入新用户密码!' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="职位">
              {getFieldDecorator('position', {
                rules: [{ required: true, message: '请输入新用户职位!' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="领域">
              {getFieldDecorator('field', {
                rules: [{ required: true, message: '请选择新用户领域!' }]
              })(
                <Select placeholder="请选择用户所属领域">
                  <Option value="NLU">NLU</Option>
                  <Option value="金融机器人">金融机器人</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const UserMGT = Form.create()(UserMGTs);

export default UserMGT;