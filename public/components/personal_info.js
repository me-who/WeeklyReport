import React from 'react';
import $ from 'jquery';
import Header from './header';
import { Card, Icon, Avatar } from 'antd';
const { Meta } = Card;

export default class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
  }
  // componentDidMount() {
  //   $.ajax({
  //     url: '/users/queryById',
  //     type: 'GET',
  //     data: {
  //      username: window.username
  //     },
  //     success: (data) => {
  //       console.log(data);
  //       this.setState({
  //         info: data[0]
  //       });
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     }
  //   });
  // }
  render() {
    const des = (
      <div>
        职位：{window.position}
        <br/>
        领域：{window.field}
      </div>
    );
    return(
      <div>
        <Header />
        <Card
          style={{ width: 400, margin: '10px auto 0' }}
          cover={<img alt="example" src="../images/bg.png" />}
          hoverable
        >
          <Meta
            avatar={<Avatar src="../images/avator.png" />}
            title={window.name}
            description={des}
          />
        </Card>
      </div>
    );
  }
}