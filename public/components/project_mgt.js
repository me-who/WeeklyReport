import React from 'react';
import $ from 'jquery';
import { Collapse, Button, List, Avatar, Modal, Form, Input, message, Icon, Tooltip } from 'antd';
const Panel = Collapse.Panel;
const ListItem = List.Item;
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class ProjectMGTs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pro: [],
      visible: false
    };
  }
  componentDidMount() {
    $.ajax({
      url: '/users/queryProAll',
      type: 'GET',
      success: (data) => {
        this.setState({
          pro: data
        });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log(values);
        const { pro } = this.state;
        pro.push({
          pro_name: values.pro_name,
          pro_des: values.pro_des
        });
        this.setState({
          visible: false,
          pro: pro
        }, function() {
          $.ajax({
            type: 'GET',
            url: '/users/insertPro',
            data: values,
            success: data => {
              message.success('项目添加成功!');
            },
            error: error => {
              console.log(error);
            }
          });
        });
      }
      else {
        message.info('请输入项目信息!');
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
  onDelete = (key) => {
    const pro = [...this.state.pro];
    $.ajax({
      url: '/users/deletePro',
      type: 'GET',
      data: {
        pro: pro.filter(item => item === key)
      },
      success: data => {
        this.setState({
          pro: pro.filter(item => item !== key)
        }, function () {
          message.success('项目删除成功!');
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <Button style={{ margin: '10px 0' }} type="primary" className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <List
          itemLayout="horizontal"
          dataSource={this.state.pro}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={item.pro_name}
                description={item.pro_des}
              />
              <Tooltip title="删除项目">
                <Icon type="delete" onClick={() => this.onDelete(item)} style={{ fontSize: 18, cursor: 'pointer', marginRight: 20 }} />
              </Tooltip>
            </List.Item>
          )}
        />
        <Modal visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form>
            <FormItem label="项目名称">
              {getFieldDecorator('pro_name', {
                rules: [{ required: true, message: '请输入新项目名称!' }]
              })(<Input />)}
            </FormItem>
            <FormItem label="项目描述">
              {getFieldDecorator('pro_des', {
                rules: [{ required: true, message: '请输入新项目描述!' }]
              })(<TextArea autosize={{ minRows: 5 }} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
const ProjectMGT = Form.create()(ProjectMGTs);

export default ProjectMGT;