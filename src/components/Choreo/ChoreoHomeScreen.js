import {Button, Layout, Menu} from 'antd';
import React from 'react';
import {connect} from "react-redux";
import {getDance} from '../../selectors/dance';
import StageDimForm from "../Formation/StageDimForm";
import withAuthorization from "../withAuthorization";
import './ChoreoHomeScreen.css';
import ChoreoPicture from "./ChoreoPicture";
import FormationPreviewCards from "./FormationPreviewCards";
import EditIcon from "../../icons/EditIcon";
import withAuthorization from "../withAuthorization";
import { getDance } from '../../selectors/dance';
import withFireStoreSync from "../withFirestoreSync";
import PerformerList from "./PerformerList";

class ChoreoHomeScreen extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    isButtonActive: 1
  };

  buttonClick = (number) => {
    this.setState({isButtonActive: number});
  };

  render() {
    if (this.props.error) {
      return <div>Invalid dance</div>
    }
    const {Header, Content, Sider} = Layout;
    const navbar = (
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
                <Button icon="edit" ghost/>
              </Menu.Item>
              <Menu.Item key="2">
                <Button icon="setting" ghost/>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </Header>
    );
    return (
      <Layout className="choreo-homescreen-body">
        {navbar}
        <Layout className="choreo-homescreen-contents">
          <Content style={{display: "flex", flexDirection: "column"}}>
            <FormationPreviewCards frames={this.props.frames} match={this.props.match} danceId={this.props.danceId}/>
          </Content>
          <Sider width="20rem">
            <div className="choreo-homescreen-tabs">
              <button
                className={this.state.isButtonActive === 1 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                onClick={() => this.buttonClick(1)}>
                ABOUT
              </button>
              <button
                className={this.state.isButtonActive === 2 ? 'choreo-homescreen-activebutton' : 'choreo-homescreen-inactivebutton'}
                onClick={() => this.buttonClick(2)}>
                PERFORMERS
              </button>
            </div>
            {
              this.state.isButtonActive === 1
                ? <div>
                  <ChoreoPicture/>
                  <h2 className="stagedim-title">STAGE DIMENSION</h2>
                  <StageDimForm danceId={this.props.danceId}/>
                </div>
                : <div className="edit-performers">
                  <PerformerList danceId={this.props.danceId}/>
                </div>
            }
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state,props) => {
  const danceId = props.match.params.choreoId
  const dance = getDance(state, danceId)
  if (dance === undefined) {
    return {
      error: true
    }
  }
  return {
    frames: dance.frames,
    name: dance.name,
    danceId: danceId
  }
};

// Auth exists
// TODO: Check if authorized to edit dance
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(withFireStoreSync(true)((connect(mapStateToProps)(ChoreoHomeScreen))));
