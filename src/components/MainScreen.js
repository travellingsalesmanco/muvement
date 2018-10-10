import {Breadcrumb, Icon, Layout, Menu, Button, Affix} from 'antd';
import React, {Component, Fragment} from 'react';
import './MainScreen.css';
import Navigation from "./Navigation";

class MainScreen extends Component {
  render() {
    const { Header, Content, Sider, Footer } = Layout;
    const { SubMenu } = Menu;
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
              >
                <Menu.Item key="1">
                  <Button shape="circle" icon="user-add" />
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
                  <p>Stage Dimensions</p>
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
