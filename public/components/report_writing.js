import React from 'react';
import $ from 'jquery';
import { Table, Icon, Button, Popconfirm, Modal, Form, Input, Select, InputNumber, message } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const confirm = Modal.confirm;


const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <TextArea value={value} onChange={e => onChange(e.target.value)} autosize={{ minRows: 3 }} />
      : <div dangerouslySetInnerHTML={{__html: typeof value === "string" ? value.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : value}}></div>
    }
  </div>
);

class ReportWrite extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '项目名称',
      dataIndex: 'project',
      width: '6%',
      render: (text, record) => this.renderColumns(text, record, 'project')
    }, {
      title: '本周原计划交付成果',
      dataIndex: 'previous_plan',
      width: '18%',
      render: (text, record) => this.renderColumns(text, record, 'previous_plan')
    }, {
      title: '本周完成',
      dataIndex: 'finished',
      width: '18%',
      render: (text, record) => this.renderColumns(text, record, 'finished')
    }, {
      title: '本周工时  ',
      dataIndex: 'working_hours_this',
      width: '6%',
      render: (text, record) => this.renderColumns(text, record, 'working_hours_this')
    }, {
      title: '下周计划  ',
      dataIndex: 'plan_for_next',
      width: '18%',
      render: (text, record) => this.renderColumns(text, record, 'plan_for_next')
    }, {
      title: '下周工时  ',
      dataIndex: 'working_hours_next',
      width: '6%',
      render: (text, record) => this.renderColumns(text, record, 'working_hours_next')
    }, {
      title: '下周需交付成果  ',
      dataIndex: 'delivered',
      width: '18%',
      render: (text, record) => this.renderColumns(text, record, 'delivered')
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        const { getFieldDecorator } = this.props.form;
        const { editable } = record;
        return (
          <div>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
              <a href="#">删除</a>
            </Popconfirm>
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.key)}>保存</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  : <a onClick={() => this.edit(record.key)}>修改</a>
              }
            </div>
          </div>
        );
      },
    }];

    this.state = {
      dataSource: [],
      count: 0,
      visible: false,
      visibleAdd: false,
      project: [],
      pre: ''
    };
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ dataSource: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ dataSource: newData });
    }
  }
  save(key) {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ dataSource: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.dataSource];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ dataSource: newData });
    }
  }
  componentDidMount() {
    $.ajax({
      url: '/users/queryProAll',
      type: 'GET',
      success: data => {
        this.setState({
          project: data
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }
  showModal = () => {
    const { count } = this.state.count;
    this.setState({
      visible: true
    });
  }
  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log(values);
        const { count, dataSource } = this.state;
        dataSource.push({
          key: count,
          tag: window.key,
          location: '北京',
          date: new Date().toLocaleDateString(),
          project: values.project,
          previous_plan: values.previous_plan,
          finished: values.finished,
          working_hours_this: values.working_hours_this,
          plan_for_next: values.plan_for_next,
          working_hours_next: values.working_hours_next,
          delivered: values.delivered
        });
        this.setState({
          visibleAdd: false,
          dataSource: dataSource
        });
      }
      else {
        message.warning('请填写完整周报内容!');
      }
    });
    this.props.form.resetFields();
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visibleAdd: false
    });
  }

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ dataSource });
      }
    };
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    this.setState({
      visibleAdd: true,
      count: count + 1,
      pre: ''
    });
  }

  showConfirm = () => {
    const { dataSource } = this.state;
    confirm({
      title: '您确认提交周报吗？',
      onOk() {

        for(let i = 0; i < dataSource.length; i ++) {
          $.ajax({
            type: 'GET',
            url: '/users/insertReport',
            data: dataSource[i],
            success: data => {
              message.success('周报提交成功!');
            },
            error: error => {
              console.log(error);
            }
          });
        }
      },
      onCancel() {

      }
    });
  }
  optionChange = () => {
    this.setState({ pre: '' });
    let project = this.props.form.getFieldValue('project');
    $.ajax({
      url: '/users/getPrevious',
      type: 'GET',
      data: {
        key: window.key,
        project: project
      },
      success: data => {
        if(data.length){
          this.setState({
            pre: data[0].delivered
          });
        }
      },
      error: err => {
        console.log(err);
      }
    });
  };


  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    let options = this.state.project.map((item, index) => {
      return (
        <Option key={index} value={item.pro_name}>{item.pro_name}</Option>
      );
    });
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button style={{ margin: '10px 0' }} type="primary" className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Table bordered dataSource={dataSource} columns={columns} />
        <Button style={{ margin: '10px 0' }} type="primary" onClick={this.showConfirm.bind(this)}>Save</Button>
        <div>
          <Modal
            visible={this.state.visibleAdd}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form>
              <FormItem label="项目名称" hasFeedback>
                {getFieldDecorator('project', {
                  validateTrigger: 'onSelect',
                  rules: [{ required: true, message: '请选择您的项目!' }]
                })(
                  <Select placeholder="请选择您的项目" onChange={this.optionChange}>
                    {options}
                  </Select>
                )}
              </FormItem>
              <FormItem label="本周原计划交付成果">
                {getFieldDecorator('previous_plan', {
                  initialValue: this.state.pre,
                  rules: [{ required: true, message: '请输入本周原计划交付成果!' }]
                })(<TextArea id="previous_plan" autosize={{ minRows: 5 }} />)}
              </FormItem>
              <FormItem label="本周完成">
                {getFieldDecorator('finished', {
                  rules: [{ required: true, message: '请输入本周完成内容!' }]
                })(<TextArea autosize={{ minRows: 5 }} />)}
              </FormItem>
              <FormItem label="本周工时">
                {getFieldDecorator('working_hours_this', {
                  rules: [{ required: true, message: '请输入本周工时!' }]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem label="下周计划">
                {getFieldDecorator('plan_for_next', {
                  rules: [{ required: true, message: '请输入下周计划!' }]
                })(<TextArea autosize={{ minRows: 5 }} />)}
              </FormItem>
              <FormItem label="下周工时">
                {getFieldDecorator('working_hours_next', {
                  rules: [{ required: true, message: '请输入下周计划工时!' }]
                })(<InputNumber min={0} />)}
              </FormItem>
              <FormItem label="下周需交付成果">
                {getFieldDecorator('delivered', {
                  rules: [{ required: true, message: '请输入下周需交付成果!' }]
                })(<TextArea autosize={{ minRows: 5 }} />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

const ReportWriting = Form.create()(ReportWrite);

export default ReportWriting;

