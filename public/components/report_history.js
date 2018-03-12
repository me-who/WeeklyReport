import React from 'react';
import $ from 'jquery';
import { DatePicker, Table } from 'antd';
const { WeekPicker, RangePicker } = DatePicker;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class ReportHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      range: []
    };
  }
  componentDidMount() {
    $.ajax({
      url: '/users/queryRepByWeek',
      type: 'GET',
      data: {
        tag: window.key,
        count: this.state.count
      },
      success: (data) => {
        for(let i = 0; i < data.length; i ++ ) {
          data[i].key = i;
        }
        this.setState({
          data: data
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  onChange = (date, dateString) => {
    // let thisWeek = Math.ceil(new Date().getDate()/7);
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1;
    const day = new Date().getDate();
    let thisWeek = getYearWeek(year, month, day);
    let selWeek = Number(dateString.slice(5, -1));
    const count = thisWeek - selWeek;
    this.setState({
      count: count
    }, function() {
      $.ajax({
        url: '/users/queryRepByWeek',
        type: 'GET',
        data: {
          tag: window.key,
          count: this.state.count
        },
        success: (data) => {
          for(let i = 0; i < data.length; i ++ ) {
            data[i].key = i;
          }
          this.setState({
            data: data
          });
        },
        error: (error) => {
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
        url: 'users/queryRepByRange',
        type: 'GET',
        data: {
          tag: window.key,
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
  render() {
    const columns = [{
      title: '项目名称',
      dataIndex: 'project',
      width: '10%'
    },{
      title: '本周原计划交付成果',
      dataIndex: 'previous_plan',
      width: '20%',
      render: text => (
        <div dangerouslySetInnerHTML={{__html: typeof text === "string" ? text.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : text}}></div>
      )
    }, {
      title: '本周完成',
      dataIndex: 'finished',
      width: '20%',
      render: text => (
        <div dangerouslySetInnerHTML={{__html: typeof text === "string" ? text.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : text}}></div>
      )
    }, {
      title: '本周工时  ',
      dataIndex: 'working_hours_this',
      width: '5%'
    }, {
      title: '下周计划  ',
      dataIndex: 'plan_for_next',
      width: '20%',
      render: text => (
        <div dangerouslySetInnerHTML={{__html: typeof text === "string" ? text.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : text}}></div>
      )
    }, {
      title: '下周工时  ',
      dataIndex: 'working_hours_next',
      width: '5%'
    }, {
      title: '下周需交付成果  ',
      dataIndex: 'delivered',
      width: '20%',
      render: text => (
        <div dangerouslySetInnerHTML={{__html: typeof text === "string" ? text.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") : text}}></div>
      )
    }];
    return(
      <div>
        <WeekPicker onChange={this.onChange} placeholder="Select week" />
        <RangePicker onChange={this.onRangeChange} />
        <Table bordered columns={columns} dataSource={this.state.data} />
      </div>
    );
  }
}

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