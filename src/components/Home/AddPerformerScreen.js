import React, { Fragment } from 'react';
import { Button, Input, Layout, Menu, Icon } from 'antd';
import { withRouter } from "react-router-dom";
import './AddPerformerScreen.css';
import { addChoreo } from "../../actions/choreoActions";
import { connect } from 'react-redux';
import { firestore } from "../../firebase";
import { defaultStageDim } from "../../constants/defaults";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class AddPerformerScreen extends React.Component {
  state = {
    names: [],
  };

  handleAdd = () => {
    this.setState({
      names: [...this.state.names, '']
    });
  };

  handleGetName = (key) => {
    const names = this.state.names.slice();
    return names[key];
  };

  handleEditName = (e, key) => {
    const names = this.state.names.slice();
    console.log(names);
    names[key] = e.target.value;
    this.setState({
      names: names
    });
  };

  handleNext = () => {
    firestore.createChoreo({
        name: this.props.choreoName,
        stageDim: defaultStageDim,
        dancers: this.state.names,
        formations: []
      }
    ).then(createdChoreo => {
      this.props.dispatch(addChoreo(createdChoreo.id, createdChoreo.data));
      this.props.history.push(`/choreo/${createdChoreo.id}`)
    });
  };

  render() {
    const { Header, Content } = Layout;
    return (
      <Fragment>
      <MobilePortrait>
        <Header>
          <div className="nav-bar">
            <div className="mp-back-button">
              <Button style={{ fontSize: '25px' }} icon="left" onClick={() => this.props.onBack()} />
            </div>
            <div className="mp-addperf-title">
              <h3 style={{ color: '#fff' }}>ADD PERFORMERS</h3>
            </div>
            <div className="mp-right-container">
              <Menu mode="horizontal" theme="dark">
                <Menu.Item key="1">
                  <Button icon="setting" ghost />
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Header>
        <Content>
          <div className="mp-add-performer-container">
            {
              this.state.names.map((performer, key) => (
                <div key={key} className="mp-performer-field">
                  <Icon type="user" style={{ color: '#fff', fontSize: '20px' }} />
                  <Input
                    className="mp-input"
                    placeholder="Input performer name"
                    value={this.handleGetName(key)}
                    onChange={(e) => this.handleEditName(e, key)}
                    onPressEnter={this.handleEditNameConfirm}
                  />
                </div>
              ))
            }
            <Button type={"default"} icon="user-add" ghost block className="mp-add-performer-button"
                    onClick={this.handleAdd}>Add Performer</Button>
            <Button type={"default"} block className="mp-next-button"
                    onClick={this.handleNext}>NEXT</Button>
          </div>
        </Content>
        </MobilePortrait>

        <MobileLandscape>
          <Header>
            <div className="nav-bar">
              <div className="back-button">
                <Button style={{ fontSize: '25px' }} icon="left" onClick={() => this.props.onBack()} />
              </div>
              <div className="ml-addperf-title">
                <h3 style={{ color: '#fff' }}>ADD PERFORMERS</h3>
              </div>
              <div className="right-container">
                <Menu mode="horizontal" theme="dark">
                  <Menu.Item key="1">
                    <Button icon="setting" ghost />
                  </Menu.Item>
                </Menu>
              </div>
            </div>
          </Header>
          <Content>
            <div className="mp-add-performer-container">
              {
                this.state.names.map((performer, key) => (
                  <div key={key} className="mp-performer-field">
                    <Icon type="user" style={{ color: '#fff', fontSize: '20px' }} />
                    <Input
                      className="mp-input"
                      placeholder="Input performer name"
                      value={this.handleGetName(key)}
                      onChange={(e) => this.handleEditName(e, key)}
                      onPressEnter={this.handleEditNameConfirm}
                    />
                  </div>
                ))
              }
              <Button type={"default"} icon="user-add" ghost block className="mp-add-performer-button"
                      onClick={this.handleAdd}>Add Performer</Button>
              <Button type={"default"} block className="mp-next-button"
                      onClick={this.handleNext}>NEXT</Button>
            </div>
          </Content>
          </MobileLandscape>

          <MinTablet>
            <Header>
              <div className="nav-bar">
                <div className="back-button">
                  <Button style={{ fontSize: '25px' }} icon="left" onClick={() => this.props.onBack()} />
                </div>
                <div className="title">
                  <h3 style={{ color: '#fff' }}>ADD PERFORMERS</h3>
                </div>
                <div className="right-container">
                  <Menu mode="horizontal" theme="dark">
                    <Menu.Item key="1">
                      <Button icon="setting" ghost />
                    </Menu.Item>
                  </Menu>
                </div>
              </div>
            </Header>
            <Content>
              <div className="add-performer-container">
                {
                  this.state.names.map((performer, key) => (
                    <div key={key} className="performer-field">
                      <Icon type="user" style={{ color: '#fff', fontSize: '20px' }} />
                      <Input
                        className="input"
                        placeholder="Input performer name"
                        value={this.handleGetName(key)}
                        onChange={(e) => this.handleEditName(e, key)}
                        onPressEnter={this.handleEditNameConfirm}
                      />
                    </div>
                  ))
                }
                <Button type={"default"} icon="user-add" ghost block className="add-performer-button"
                        onClick={this.handleAdd}>Add Performer</Button>
                <Button type={"default"} block className="next-button"
                        onClick={this.handleNext}>NEXT</Button>
              </div>
            </Content>
            </MinTablet>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    maxChoreoId: state.choreos.length - 1
  }
};

export default withRouter(connect(mapStateToProps)(AddPerformerScreen));
