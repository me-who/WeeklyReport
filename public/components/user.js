import React from 'react';
import Header from './header';
import ReportWriting from './report_writing';
import ReportHistory from './report_history';
import { Tabs, Menu, Dropdown, Button, Icon } from 'antd';
const TabPane = Tabs.TabPane;

export default class User extends React.Component {
  handleExit() {
    window.isLogin = false;
  }
  render() {
    const dropdown = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" href="/#/personal">个人资料</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="/#/modify">修改密码</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="#" onClick={this.handleExit}>退出登录</a>
        </Menu.Item>
      </Menu>
    );
    const settings = (
      <Dropdown overlay={dropdown}>
        <Button>
          <Icon type="setting"/>
        </Button>
      </Dropdown>
    );
    return (
      <div>
        <Header/>
        <Tabs tabPosition='left' defaultActiveKey="1" tabBarExtraContent={settings}>
          <TabPane tab="周报填写" key="1">
            <ReportWriting/>
          </TabPane>
          <TabPane tab="历史周报" key="2">
            <ReportHistory/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
};
