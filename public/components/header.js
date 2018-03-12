import React from 'react';
import { Row, Col, Button, Icon } from 'antd';
const ButtonGroup = Button.Group;

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  logoClick() {
    window.isLogin = false;
  }
  // handleBackward() {
  //   this.props.history.goBack();
  // }
  // handleForward() {
  //   this.props.history.push();
  // }
  render() {
    const wel = window.isLogin ? '' : 'hide';
    return(
      <Row className="header">
        <Col span={2}></Col>
        <Col span={4}>
          <a href="#" onClick={this.logoClick}>WeeklyReport</a>
        </Col>
        <Col span={16}>
          {/*<ButtonGroup style={{ float: 'right' }}>*/}
            {/*<Button type="default" onClick={this.handleBackward.bind(this)}>*/}
              {/*<Icon type="left" />Go back*/}
            {/*</Button>*/}
            {/*<Button type="default" onClick={this.handleForward.bind(this)}>*/}
              {/*Go forward<Icon type="right" />*/}
            {/*</Button>*/}
          {/*</ButtonGroup>*/}
          <h3 className={wel}>欢迎！{window.name}</h3>
        </Col>
        <Col span={2}></Col>
      </Row>
    );
  }
}

export default Header;