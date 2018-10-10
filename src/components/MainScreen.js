import {Breadcrumb, Layout, Menu, Button, Drawer} from 'antd';
import React, {Component, Fragment} from 'react';
import './MainScreen.css';
import Navigation from "./Navigation";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false
    }
  }
  showDrawer = (item) => {
    console.log(item);
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { Content, Sider, Footer } = Layout;
    return (
      <Fragment>
        <Layout className="body">
          <Navigation/>
          <Layout className="contents">
            <Content style={{ padding: '0 50px' }}>
              <div className="section-title-container">
                <div className="section-title">
                  <h3>Introduction (30 seconds)</h3>
                </div>
              </div>
              <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                Insert Konva Stage
              </div>
              <Breadcrumb separator=">" className="breadcrumb">
                <Breadcrumb.Item>NUS BLAST! Showcase</Breadcrumb.Item>
                <Breadcrumb.Item>Introduction (30 seconds)</Breadcrumb.Item>
              </Breadcrumb>
            </Content>
            <Sider width={200} className="sider">
              <Menu
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
                theme="dark"
                onClick={this.showDrawer}
              >
                <Menu.Item key="1">
                  <Button shape="circle" icon="user-add"/>
                  <p>Performers</p>
                </Menu.Item>
                <Menu.Item key="2">
                  <Button shape="circle" icon="file-add" />
                  <p>Add Formation</p>
                </Menu.Item>
                <Menu.Item key="3">
                  <Button shape="circle" icon="customer-service" />
                  <p>Add Music</p>
                </Menu.Item>
                <Menu.Item key="4">
                  <Button shape="circle" icon="border-inner" />
                  <p>Stage Dimension</p>
                </Menu.Item>
                <Menu.Item key="5">
                  <Button shape="circle" icon="left" />
                  <p>Previous</p>
                </Menu.Item>
                <Menu.Item key="6">
                  <Button shape="circle" icon="right" />
                  <p>Next</p>
                </Menu.Item>
              </Menu>
            </Sider>
            <Drawer
              title="Drawer"
              placement={this.state.placement}
              closable={true}
              onClose={this.onClose}
              visible={this.state.visible}
              mask={false}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
          </Layout>
          <Footer className="footer">
            Muvement© 2018. Made with <span role="img" aria-label="Love">❤️</span>by TSCo.
          </Footer>
        </Layout>
      </Fragment>
    );
  }
}

export default MainScreen;