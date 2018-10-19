import React from 'react';
import './ChoreoHomeScreen.css';
import {Button, Layout, Menu, Row, Col, DatePicker} from 'antd';
import connect from "react-redux/es/connect/connect";
import {BrowserRouter as Route} from "react-router-dom";
import FrameScreen from "../Formation/FrameScreen";
import ChoreoPicture from "./ChoreoPicture";
import StageDimForm from "../Formation/StageDimForm";
import FormationPreviewCards from "./FormationPreviewCards";

class ChoreoHomeScreen extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    isButtonActive: 1
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
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  }

  buttonClick = (number) => {
    this.setState({isButtonActive: number});
  }

  render() {
    const {Header, Content, Sider} = Layout;
    const {startValue, endValue, endOpen} = this.state;
    return (
      <Layout className="choreo-homescreen-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <Header>
          <div className="nav-bar">
            <div>
              <Button className="backbutton" style={{fontSize: '25px'}} icon="left"
                      onClick={() => this.props.history.push('/')}/>
              <span className="backbutton-desc">Dashboard</span>
            </div>
            <div className="title">
              <h3 style={{color: '#fff'}}>{this.props.name}</h3>
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
            <FormationPreviewCards frames={this.props.frames} match={this.props.match} danceId={this.props.danceId}/>
          </Content>
          <Sider
            width="350px">
            <div className="choreo-homescreen-tabs">
              <button
                className={this.state.isButtonActive === 1 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                onClick={() => this.buttonClick(1)}>ABOUT</button>
              <button  className = {this.state.isButtonActive === 2 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                      onClick={() => this.buttonClick(2)}>PERFORMERS</button>
            </div>
            {
                this.state.isButtonActive === 1
                ? <div>
                    <ChoreoPicture />
                    <h2 className="stagedim-title">STAGE DIMENSION</h2>
                    <StageDimForm />
                  </div>
                : <div className="edit-performers">
                    <Button className="edit-performers-button" icon="edit" ghost block>EDIT PERFORMERS</Button>
                </div>
            }
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
    name: state.dances[state.UI.activeDance].name,
    danceId: state.UI.activeDance
  }
};

export default connect(mapStateToProps)(ChoreoHomeScreen);
