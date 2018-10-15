import React from 'react';
import './ChoreoHomeScreen.css';
import {Button, Layout, Menu, Row, Col, DatePicker} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";
import FrameScreen from "../FrameScreen";
import ChoreoPicture from "./ChoreoPicture";
import FormationPreviewCards from "./FormationPreviewCards";

class ChoreoHomeScreen extends React.Component {
    state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };

    disabledStartDate = (startValue) => {
      const endValue = this.state.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
      const startValue = this.state.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
      this.setState({
        [field]: value,
      });
    }

    onStartChange = (value) => {
      this.onChange('startValue', value);
    }

    onEndChange = (value) => {
      this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
      if (!open) {
        this.setState({ endOpen: true });
      }
    }

    handleEndOpenChange = (open) => {
      this.setState({ endOpen: open });
    }

  render() {
    const {Header, Content, Sider} = Layout;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Layout className="choreo-homescreen-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <Header>
          <div className="nav-bar">
              <div className="back-button">
                <Button style={{ fontSize: '25px' }} icon="left" onClick={() => this.props.history.goBack()}/>
              </div>
            <div className="title">
              <h3 style={{ color: '#fff'}}>{this.props.name}</h3>
            </div>
            <div className="right-container">
              <Menu mode="horizontal" theme="dark">
                <Menu.Item key="1">
                  <Button icon="setting" ghost/>
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Header>
        <Layout className="choreo-homescreen-contents">
        <Content style={{display: "flex", flexDirection: "column"}}>
            {/*<FormationPreviewCards data={["1. Introduction (30 seconds)", "2. Straight Line"]} />*/}
          <FormationPreviewCards data={this.props.frames} match={this.props.match}/>
        </Content>
        <Sider
        width="400px">
            <ChoreoPicture />
            <div className="performance-date">
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  format="DD/MM/YYYY"
                  value={startValue}
                  placeholder="Start Date of Performance"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
            </div>
            <div className="performance-date">
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  className = "performance-date"
                  format="DD/MM/YYYY"
                  value={endValue}
                  placeholder="End Date of Performance"
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
            </div>
        </Sider>
      </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.dances[state.UI.activeDance]);
  return {
    frames: state.dances[state.UI.activeDance].frames,
    name: state.dances[state.UI.activeDance].name
  }
};

export default connect(mapStateToProps)(ChoreoHomeScreen);
