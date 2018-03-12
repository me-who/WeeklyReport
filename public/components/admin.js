import React from 'react';
import Header from './header';
import UserMGT from './user_mgt';
import ProjectMGT from './project_mgt';
import ReportMGT from './report_mgt';
import { Tabs, Menu, Dropdown, Button, Icon } from 'antd';
const TabPane = Tabs.TabPane;

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
  }
  handleExit() {
    window.isLogin = false;
  }
  render() {
    const dropdown = (
      <Menu>
        {/*<Menu.Item>*/}
          {/*<a rel="noopener noreferrer" href="/#/personal">个人资料</a>*/}
        {/*</Menu.Item>*/}
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
          <Icon type="setting" />
        </Button>
      </Dropdown>
    );
    return(
      <div>
        <Header />
        <Tabs tabPosition='left' defaultActiveKey="1" tabBarExtraContent={settings}>
          <TabPane tab="用户管理" key="1">
            <UserMGT />
          </TabPane>
          <TabPane tab="项目管理" key="2">
            <ProjectMGT />
          </TabPane>
          <TabPane tab="周报管理" key="3">
            <ReportMGT />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}