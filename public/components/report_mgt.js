import React from 'react';
import $ from 'jquery';
import { Table, Input, Popconfirm, DatePicker, Button, message } from 'antd';
const { TextArea } = Input;
const { WeekPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <TextArea value={value} onChange={e => onChange(e.target.value)} autosize={{ minRows: 3 }} />
      : <div dangerouslySetInnerHTML={{__html: typeof value === "string" ? value.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : value}}></div>
    }
  </div>
);

function getYearWeek (year, month, day) {
  //date1是当前日期
  //date2是当年第一天
  //d是当前日期是今年第多少天
  //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
  var date1 = new Date(year, parseInt(month) - 1, day),
      date2 = new Date(year, 0, 1),
      d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
}

export default class ReportMGT extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: '6%',
      // render: (text, record) => this.renderColumns(text, record, 'name'),
      sorter: (a, b) => a.name.length - b.name.length
    }, {
      title: '领域',
      dataIndex: 'field',
      width: '7%',
      // render: (text, record) => this.renderColumns(text, record, 'field'),
    }, {
      title: '项目名称',
      dataIndex: 'project',
      width: '7%',
      // render: (text, record) => this.renderColumns(text, record, 'project'),
    }, {
      title: '本周原计划交付成果',
      dataIndex: 'previous_plan',
      width: '13%',
      render: (text, record) => this.renderColumns(text, record, 'previous_plan'),
    }, {
      title: '本周完成',
      dataIndex: 'finished',
      width: '13%',
      render: (text, record) => this.renderColumns(text, record, 'finished'),
    }, {
      title: '本周工时',
      dataIndex: 'working_hours_this',
      width: '7%',
      render: (text, record) => this.renderColumns(text, record, 'working_hours_this'),
    }, {
      title: '下周计划',
      dataIndex: 'plan_for_next',
      width: '13%',
      render: (text, record) => this.renderColumns(text, record, 'plan_for_next'),
    }, {
      title: '下周工时',
      width: '7%',
      dataIndex: 'working_hours_next',
      render: (text, record) => this.renderColumns(text, record, 'working_hours_next'),
    }, {
      title: '下周需交付成果',
      dataIndex: 'delivered',
      width: '13%',
      render: (text, record) => this.renderColumns(text, record, 'delivered'),
    }, {
      title: '提交时间',
      dataIndex: 'datetime',
      width: '8%'
    }, {
      title: '编辑',
      dataIndex: 'operation',
      width: '6%',
      render: (text, record) => {
        const { editable } = record;
        return (
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
        );
      },
    }];
    this.state = {
      data: [],
      count: 0,
      week: '',
      range: []
    };
    this.cacheData = this.state.data.map(item => ({ ...item }));
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
  componentDidMount() {
    $.ajax({
      url: '/users/queryRepAll',
      type: 'GET',
      data: {
        count: this.state.count
      },
      success: data => {
        for(let i = 0; i < data.length; i ++ ) {
          data[i].key = i;
        }
        this.setState({
          data: data
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    console.log(target);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      $.ajax({
        url: '/users/updateRep',
        type: 'GET',
        data: target,
        success: data => {
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  onWeekChange = (date, dateString) => {
    // let thisWeek = Math.ceil(new Date().getDate()/7);
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1;
    const day = new Date().getDate();
    let thisWeek = getYearWeek(year, month, day);
    let selWeek = Number(dateString.slice(5, -1));
    const count = thisWeek - selWeek;
    this.setState({
      count: count,
      week: dateString
    }, function() {
      $.ajax({
        url: '/users/queryRepAll',
        type: 'GET',
        data: {
          count: this.state.count
        },
        success: data => {
          for(let i = 0; i < data.length; i ++ ) {
            data[i].key = i;
          }
          this.setState({
            data: data
          });
        },
        error: error => {
          console.log(error);
        }
      });
    });
  }
  onRangeChange = (date, dateString) => {
    this.setState({
      range: dateString
    }, function () {
      $.ajax({
        url: 'users/queryRangeRepAll',
        type: 'GET',
        data: {
          range: this.state.range
        },
        success: data => {
          for(let i = 0; i < data.length; i ++ ) {
            data[i].key = i;
          }
          this.setState({
            data: data
          });
        },
        error: error => {
          console.log(error);
        }
      });
    });
  }

  handleExport = () => {
    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "get");
    form.attr("id", "export");
    form.attr("action", "/users/queryWeekRep");
    var input = $("<input>");
    input.attr("type", "hidden");
    input.attr("name", "count");
    input.attr("id", "count");
    input.attr("value", this.state.count);
    $("body").append(form);
    form.append(input);
    form.submit();
  }
  rangeExport = () => {
    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "get");
    form.attr("id", "export");
    form.attr("action", "/users/queryRangeRep");
    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "start");
    input1.attr("id", "start");
    input1.attr("value", this.state.range[0]);
    var input2 = $("<input>");
    input2.attr("type", "hidden");
    input2.attr("name", "end");
    input2.attr("id", "end");
    input2.attr("value", this.state.range[1]);
    $("body").append(form);
    form.append(input1);
    form.append(input2);
    form.submit();
  }
  render() {
    return(
      <div>
        <WeekPicker onChange={this.onWeekChange} style={{marginRight: '20px'}} placeholder="Select week" />
        <RangePicker onChange={this.onRangeChange} />
        <Table bordered dataSource={this.state.data} scroll={{ x: 1600 }} columns={this.columns} style={{ marginTop: '5px'}} />
        <div style={{ margin: '20px 0'}}>
          <Button type="primary" onClick={this.handleExport} style={{ marginRight: '50px'}}>
            按周导出周报
          </Button>
          <Button type="primary" onClick={this.rangeExport}>
            按日期导出周报
          </Button>
        </div>
      </div>
    );
  }
}