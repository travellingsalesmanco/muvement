import { Button, Input, Layout, Modal, Spin } from "antd";
import React, { Component, Fragment } from "react";
import connect from "react-redux/es/connect/connect";
import { Prompt } from 'react-router'
import {
  addAndSetActiveFormation,
  clearTrialChoreo,
  removeFormation,
  transferTrialChoreo
} from "../../actions/choreoActions";
import { renameFormation } from "../../actions/formationActions";
import { LOAD_ANIMATED_VIEW, UNLOAD_ANIMATED_VIEW } from "../../constants/actionTypes";
import GradientSVG from "../../icons/GradientSVG";
import { loadingIcon } from "../../icons/LoadingIcon";
import { getChoreo } from "../../selectors/choreo";
import { LogInScreen } from "../Auth/LogIn";
import { SignUpScreen } from "../Auth/SignUp";
import HorizontalSlideList from "../Formation/HorizontalSlideList";
import Navigation from "../Formation/Navigation";
import PerformerList from "../Formation/PerformerList";
import ShowView from "../Formation/ShowView";
import SidePanel from "../Formation/SidePanel";
import VerticalSlideList from "../Formation/VerticalSlideList";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import ResponsiveStageCanvas from "../StageCanvas/ResponsiveStageCanvas";

const SectionTitle = ({ mobile, formationName, handleEditName, handleEditNameConfirm }) => (
  <div className="section-title-container">
    <div className="section-title" style={{ margin: mobile ? '1rem 2rem' : '2rem' }}>
      <div className="section-title-inner">
        <Input
          placeholder="Enter formation name"
          defaultValue={formationName}
          onBlur={handleEditName}
          onPressEnter={handleEditNameConfirm}
        />
      </div>
    </div>
  </div>
);

const MobileSwitchTabs = ({ activeButton, handleClick }) => (
  <div className="mobile-switch-tabs">
    <button
      className={activeButton === 1 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(1)}>
      FORMATION
    </button>
    <button
      className={activeButton === 2 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(2)}>
      PERFORMERS
    </button>
    <button
      className={activeButton === 3 ? 'mobile-switch-tabs-active' : 'mobile-switch-tabs-inactive'}
      onClick={() => handleClick(3)}>
      SHOW
    </button>
  </div>
);

const SwitchTabs = ({ activeButton, handleEditPerformer, handleOnClose }) => (
  <Fragment>
    <div className="mobile-switch-tabs">
      <button
        className={activeButton === 0 ? 'switch-tabs-active' : 'switch-tabs-inactive'}
        onClick={() => handleOnClose()}>
        FORMATION
      </button>
      <button
        className={activeButton === 1 ? 'switch-tabs-active' : 'switch-tabs-inactive'}
        onClick={() => handleEditPerformer()}>
        PERFORMERS
      </button>
    </div>
  </Fragment>
);

class TrialFormationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      sidePanelID: 0,
      formationName: '',
      activeButton: props.animated ? 3 : 2,
      modalVisible: false,
      trialLogIn: false,
      trialSignUp: false,
      backButtonPressed: false,
    }
  }

  componentDidMount() {
    this.props.dispatch(clearTrialChoreo());
  }

  componentDidUpdate() {
    // if (true) {
    //   window.onbeforeunload = () => true
    // } else {
    //   window.onbeforeunload = undefined
    // }
  }

  handleClick = (number) => {
    if (number === 3 && this.state.activeButton !== 3) {
      this.props.dispatch({ type: LOAD_ANIMATED_VIEW })
    } else if (this.state.activeButton === 3) {
      this.props.dispatch({ type: UNLOAD_ANIMATED_VIEW })
    }
    this.setState({ activeButton: number });
  };

  handleEditPerformer = () => {
    this.setState({
      visible: true,
      sidePanelID: 1,
    });
  };

  handleAddFormation = () => {
    this.props.dispatch(addAndSetActiveFormation(this.props.choreoId, this.props.formationId + 1));
  };

  handleRemoveFormation = () => {
    this.props.dispatch(removeFormation(this.props.choreoId, this.props.formationId));
  };

  onClose = () => {
    this.setState({
      visible: false,
      sidePanelID: 0
    });
  };

  handleEditName = e => {
    this.setState({
      formationName: e.target.value,
    }, () => {
      this.props.dispatch(renameFormation(this.props.choreoId, this.props.formationId, this.state.formationName));
    });
  };

  handleEditNameConfirm = e => {
    e.target.blur();
  };

  setModalVisible = (modalVisible, source) => {
    if (source === 'back') {
      this.setState({
        modalVisible: modalVisible,
        trialLogIn: false,
        trialSignUp: false,
        backButtonPressed: true
      });
    } else {
      this.setState({
        modalVisible: modalVisible,
        trialLogIn: false,
        trialSignUp: false,
        backButtonPressed: false
      });
    }
  };

  handleSignUp = () => {
    this.setState({
      trialSignUp: true,
      trialLogIn: false
    })
  };

  handleLogIn = () => {
    this.setState({
      trialLogIn: true,
      trialSignUp: false
    })
  };

  handleSwitch = (dest) => {
    if (dest === 'login') {
      this.handleLogIn();
    } else if (dest === "signup") {
      this.handleSignUp();
    }
  };

  handleTransferTrial = () => {
    return this.props.dispatch(transferTrialChoreo());
  };

  render() {
    const { Content, Sider } = Layout;
    const { activeButton, sidePanelID, trialLogIn, trialSignUp, backButtonPressed } = this.state;
    const { loading, choreoId } = this.props;
    return (
      <Fragment>
        {/*<Prompt*/}
          {/*when={true}*/}
          {/*message='You have unsaved changes, are you sure you want to leave?'*/}
        {/*/>*/}
        <MobilePortrait>
          <Layout className="mp-body">
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId}
                        trial={true} openModal={(source) => this.setModalVisible(true, source)}/>
            <Layout className="contents">
              <Content className="contents-main">
                <SectionTitle key={this.props.formationName} mobile={true} formationName={this.props.formationName}
                              handleEditName={this.handleEditName}
                              handleEditNameConfirm={this.handleEditNameConfirm} />
                <div className="formationscreen-stage" style={{ flexBasis: "60%", flexGrow: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%" }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                           withGrid animated={this.props.animated} />
                  </div>
                </div>
                <div style={{flexBasis: "10%", flexShrink: 1}}>
                  <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                </div>
                <div style={{ flexBasis: "35%", flexShrink: 1, height:"35vh", overflow:"scroll" }}>
                  {
                    activeButton === 1 &&
                    <Fragment>
                      <div className="horizontal-list" style={{ overflowX: 'scroll', marginTop: '1em' }}>
                        <HorizontalSlideList choreoId={choreoId} editable />
                      </div>
                      <div className="formationscreen-buttons">
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div style={{
                            padding: '0.5em 0.5em 1em 1em',
                            flex: 1
                          }}>
                            <Button type={"default"} icon="plus" ghost block style={{ borderRadius: '1em' }}
                                    onClick={this.handleAddFormation}>Add</Button>
                          </div>
                          <div style={{
                            padding: '0.5em 2em 1em 0.5em',
                            flex: 1
                          }}>
                            <Button className="delete-formation" icon="delete" ghost block
                                    style={{ borderRadius: '1em' }}
                                    onClick={this.handleRemoveFormation}>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  }
                  {
                    activeButton === 2 &&
                    <div style={{overflowY: "scroll"}}>
                      <PerformerList choreoId={this.props.choreoId} />
                    </div>
                  }
                  {
                    activeButton === 3 &&
                    <ShowView choreoId={this.props.choreoId} editable />
                  }
                </div>
              </Content>
            </Layout>
          </Layout>
          <Modal
            centered
            visible={this.state.modalVisible}
            onCancel={() => this.setModalVisible(false)}
            footer={null}
            className="new-choreo-modal"
          >
            <div className="new-choreo-modal-inner">
              {
                !trialLogIn && !trialSignUp &&
                <Fragment>
                  { backButtonPressed && <p style={{ fontSize: '1.5em', fontFamily: 'Sen-Bold' }}>Your changes are about to be lost.</p>}
                  <p style={{ fontSize: '1.5em', fontFamily: 'Sen-Bold' }}>Sign up/Log in now to save your work.</p>
                  <div style={{ display: 'flex', }}>
                    <Button className="new-choreo-modal-inner-button" block onClick={this.handleSignUp}>SIGN UP</Button>
                    <Button className="new-choreo-modal-inner-button" block onClick={this.handleLogIn}>LOG IN</Button>
                  </div>
                  { backButtonPressed && <p style={{ margin: '1em 0 0 0', color: '#fff', textDecoration: 'underline' }} onClick={() => this.props.history.push('/')}>Continue anyway</p>}
                </Fragment>
              }
              {
                trialLogIn && <LogInScreen switchHandler={() => this.handleSwitch('signup')}/>
              }
              {
                trialSignUp && <SignUpScreen switchHandler={() => this.handleSwitch('login')}/>
              }
            </div>
          </Modal>
        </MobilePortrait>

        <MobileLandscape>
          <Layout className="body" style={{ height: '100vh' }}>
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
            <div style={{ background: '#000', flex: 1, overflow: "hidden" }}>

              <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                     withGrid animated={this.props.animated} />
            </div>
          </Layout>
        </MobileLandscape>

        <MinTablet>
          <Layout className="body">
            <GradientSVG
              startColor="#24c6dc"
              endColor="#514a9d"
              idCSS="cool-gradient"
            />
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId}
                        trial={true} openModal={(source) => this.setModalVisible(true, source)}
            />
            <Layout className="contents">
              <Content className="contents-main">
                <SectionTitle key={this.props.formationName} formationName={this.props.formationName}
                              handleEditName={this.handleEditName}
                              handleEditNameConfirm={this.handleEditNameConfirm} />
                <div className="formationscreen-stage"
                     style={{ flexBasis: "62.5%", flexGrow: 5 }}>
                  <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                         withGrid animated={this.props.animated} trial/>
                </div>
                <div style={{ flexBasis: "25%", flexGrow: 2 }}>
                  <ShowView choreoId={this.props.choreoId} editable music={false}/>
                </div>
              </Content>
              <Sider width={'16rem'} className="sider">
                <div className="button-container">
                  <SwitchTabs activeButton={sidePanelID} handleEditPerformer={this.handleEditPerformer} handleOnClose={this.onClose}/>
                </div>
                <h3 className="slide-list-title">All Formations</h3>
                <div style={{ display: 'flex' }}>
                  <Button type={"default"} icon="plus" ghost block onClick={this.handleAddFormation}
                          style={{ margin: '0 0.5em 1em 1em', borderColor: '#24c6dc', color: '#24c6dc' }}>
                    <span>Add</span>
                  </Button>
                  <Button type={"default"} icon="delete" ghost block onClick={this.handleRemoveFormation}
                          style={{ margin: '0 1em 1em 0.5em', borderColor: '#514a9d', color: '#514a9d' }}>
                    <span>Delete</span>
                  </Button>
                </div>
                <div style={{ overflowY: 'scroll', height: `calc(100vh - 234px)` }}>
                  <VerticalSlideList choreoId={choreoId} editable />
                </div>
              </Sider>
              <SidePanel
                choreoId={this.props.choreoId}
                placement={this.state.placement}
                closable={true}
                onClose={this.onClose}
                visible={this.state.visible}
                mask={false}
                id={this.state.sidePanelID}
                width={'16rem'}
              />
            </Layout>
          </Layout>
          <Modal
            centered
            visible={this.state.modalVisible}
            onCancel={() => this.setModalVisible(false)}
            footer={null}
            className="new-choreo-modal"
          >
            <div className="new-choreo-modal-inner">
              {
                !trialLogIn && !trialSignUp &&
                  <Fragment>
                    { backButtonPressed && <p style={{ fontSize: '1.5em', fontFamily: 'Sen-Bold' }}>Your changes are about to be lost.</p>}
                    <p style={{ fontSize: '1.5em', fontFamily: 'Sen-Bold' }}>Sign up/Log in now to save your work.</p>
                    <div style={{ display: 'flex', }}>
                    <Button className="new-choreo-modal-inner-button" block onClick={this.handleSignUp}>SIGN UP</Button>
                    <Button className="new-choreo-modal-inner-button" block onClick={this.handleLogIn}>LOG IN</Button>
                    </div>
                    { backButtonPressed && <p style={{ margin: '1em 0 0 0', color: '#fff', textDecoration: 'underline' }} onClick={() => this.props.history.push('/')}>Continue anyway</p>}
                  </Fragment>
              }
              {
                trialLogIn && <LogInScreen trialHandler={this.handleTransferTrial} switchHandler={() => this.handleSwitch('signup')}/>
              }
              {
                trialSignUp && <SignUpScreen trialHandler={this.handleTransferTrial} switchHandler={() => this.handleSwitch('login')}/>
              }
            </div>
          </Modal>
        </MinTablet>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  const trialChoreo = getChoreo(state, "trial");
  const activeFormation = trialChoreo.formations[state.UI.activeFormation];
  return {
    choreoId: 'trial',
    formationId: state.UI.activeFormation,
    choreoName: trialChoreo.name,
    formationName: activeFormation.name,
    animated: state.UI.animated
  }
}

export default connect(mapStateToProps)(TrialFormationScreen);
