import { Button, Input, Layout, Spin, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
  addAndSetActiveFormation,
  removeFormation,
  renameChoreo,
  updateChoreoIfNewer
} from "../../actions/choreoActions";
import { renameFormation } from "../../actions/formationActions";
import { LOAD_ANIMATED_VIEW, UNLOAD_ANIMATED_VIEW } from '../../constants/actionTypes';
import FileAddIcon from "../../icons/FileAddIcon";
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import { loadingIcon } from "../../icons/LoadingIcon";
import UserAddIcon from "../../icons/UserAddIcon";
import { getChoreo } from '../../selectors/choreo';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import withAuthorization from "../withAuthorization";
import withFireStoreSync from "../withFirestoreSync";
import './FormationScreen.css';
import HorizontalSlideList from "./HorizontalSlideList";
import Navigation from "./Navigation";
import PerformerList from "./PerformerList";
import PreviewSlideList from "./PreviewSlideList";
import SidePanel from "./SidePanel";
import VerticalSlideList from "./VerticalSlideList";
import ShowView from './ShowView';
import Timeline from './Timeline/Timeline';
import { getTimeline } from '../../selectors/layout';
import StageDimForm from "./StageDimForm";
import ChoreoPicture from "../Choreo/ChoreoPicture";

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

const Properties = ({ choreoId, choreoName, handleNameEdit }) => (
  <div className="mp-formation-properties-modal">
    <div>
      <Input
        defaultValue={choreoName}
        onBlur={handleNameEdit}
        onPressEnter={(e) => e.target.blur()}
      />
    </div>
    <ChoreoPicture choreoId={choreoId} />
    <div style={{ pointerEvents: "None" }}>
      <ResponsiveStageCanvas choreoId={choreoId} formationId={0} withGrid preview />
    </div>
    <StageDimForm choreoId={choreoId} />
  </div>
);

class FormationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      sidePanelID: 0,
      formationName: '',
      activeButton: props.animated ? 3 : 2,
      isManualOverwriteAddressed: false,
      isPropertiesVisible: false
    }
  }

  confirmManualOverwriteModal = () => {
    let affectedChoreo = this.props.affectedChoreos[0];
    this.props.dispatch(updateChoreoIfNewer(affectedChoreo.id, affectedChoreo.data)).then(() =>
      this.setState({
        isManualOverwriteAddressed: true
      })
    );
  };

  cancelManualOverwriteModal = () => {
    this.setState({
      isManualOverwriteAddressed: true
    });
  };

  handleShowProperties = () => {
    this.setState({
      isPropertiesVisible: true
    });
  };

  handleHideProperties = () => {
    this.setState({
      isPropertiesVisible: false
    });
  };

  handleNameEdit = (e) => {
    // Only dispatch if name is not the same
    let newName = e.target.value;
    if (newName !== this.props.choreoName) {
      this.props.dispatch(renameChoreo(this.props.choreoId, newName));
    }
  };

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

  handleEditTimeline = () => {

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

  render() {
    const { Content, Sider } = Layout;
    const { activeButton, isManualOverwriteAddressed, isPropertiesVisible } = this.state;
    const { loading, manualOverwrite, affectedChoreos, choreoId, choreoName } = this.props;
    return (
      <Fragment>
        <MobilePortrait>
          <Spin indicator={loadingIcon} spinning={loading}>
            <Modal
              centered
              visible={manualOverwrite && !isManualOverwriteAddressed}
              onOk={this.confirmManualOverwriteModal}
              onCancel={this.cancelManualOverwriteModal}
              maskClosable={false}
              closable={false}
              cancelText={"Keep my local version"}
              okText={"Replace with newer version"}
              keyboard={false}
            >
              <p>A newer version of this choreo is found. Would you like to replace your local version?</p>
            </Modal>
            <Modal
              centered
              visible={isPropertiesVisible}
              onCancel={this.handleHideProperties}
              footer={null}
            >
              {<Properties choreoId={choreoId} choreoName={choreoName} handleNameEdit={this.handleNameEdit} />}
            </Modal>
            <Layout className="mp-body">
              <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId}
                          editable handleShowProperties={this.handleShowProperties} />
              <Layout className="contents">
                <Content className="contents-main">
                  <SectionTitle key={this.props.formationName} mobile={true} formationName={this.props.formationName}
                                handleEditName={this.handleEditName}
                                handleEditNameConfirm={this.handleEditNameConfirm} />
                  <div className="formationscreen-stage"
                       style={{ flexBasis: "60%", flexGrow: 10, position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%" }}>
                      <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId}
                                             editable
                                             withGrid animated={this.props.animated} />
                    </div>
                  </div>
                  <div style={{ flexBasis: "10%", flexShrink: 1, paddingTop: '2em' }}>
                    <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                  </div>
                  <div style={{ flexBasis: "30%", flexShrink: 1, height: "30vh", overflow: "scroll" }}>
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
                      <div style={{ overflowY: "scroll" }}>
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
          </Spin>
        </MobilePortrait>

        <MobileLandscape>
          <Spin indicator={loadingIcon} spinning={loading}>
            <Modal
              centered
              visible={manualOverwrite && !isManualOverwriteAddressed}
              onOk={this.confirmManualOverwriteModal}
              onCancel={this.cancelManualOverwriteModal}
              maskClosable={false}
              closable={false}
              cancelText={"Keep my local version"}
              okText={"Replace with newer version"}
              keyboard={false}
            >
              <p>A newer version of this choreo is found. Would you like to replace your local version?</p>
            </Modal>
            <Layout className="body" style={{ height: '100vh' }}>
              <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
              <div style={{ background: '#000', flex: 1, overflow: "hidden" }}>

                <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                       withGrid animated={this.props.animated} />
              </div>
            </Layout>
          </Spin>
        </MobileLandscape>

        <MinTablet>
          <Spin indicator={loadingIcon} spinning={loading}>
            <Modal
              centered
              visible={manualOverwrite && !isManualOverwriteAddressed}
              onOk={this.confirmManualOverwriteModal}
              onCancel={this.cancelManualOverwriteModal}
              maskClosable={false}
              closable={false}
              cancelText={"Keep my local version"}
              okText={"Replace with newer version"}
              keyboard={false}
            >
              <p>A newer version of this choreo is found. Would you like to replace your local version?</p>
            </Modal>
            <Modal
              centered
              visible={isPropertiesVisible}
              onCancel={this.handleHideProperties}
              footer={null}
            >
              {<Properties choreoId={choreoId} choreoName={choreoName} handleNameEdit={this.handleNameEdit} />}
            </Modal>
            <Layout className="body">
              <GradientSVG
                startColor="#24c6dc"
                endColor="#514a9d"
                idCSS="cool-gradient"
              />
              <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId}
                          editable handleShowProperties={this.handleShowProperties} />
              <Layout className="contents">
                <Content className="contents-main">
                  <SectionTitle key={this.props.formationName} formationName={this.props.formationName}
                                handleEditName={this.handleEditName}
                                handleEditNameConfirm={this.handleEditNameConfirm} />
                  <div className="formationscreen-stage"
                       style={{ flexBasis: "62.5%", flexGrow: 5 }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                           withGrid animated={this.props.animated} />
                  </div>
                  <div style={{ flexBasis: "25%", flexGrow: 2 }}>
                    <ShowView choreoId={this.props.choreoId} editable />
                  </div>
                </Content>
                <Sider width={'12rem'} className="sider">
                  <div className="button-container">
                    <Button className="sider-button" shape="circle" onClick={this.handleEditPerformer}>
                      <UserAddIcon style={{ fontSize: '33px' }} />
                    </Button>
                    <Button className="sider-button" shape="circle" onClick={this.handleAddFormation}>
                      <FileAddIcon style={{ fontSize: '25px' }} />
                    </Button>
                    <Button className="sider-button" shape="circle" onClick={this.handleEditTimeline}>
                      <HeadphoneIcon style={{ fontSize: '25px' }} />
                    </Button>
                  </div>
                  <h3 className="slide-list-title">All Formations</h3>
                  <div style={{ overflowY: 'scroll', height: `calc(100vh - 234px)` }}>
                    <VerticalSlideList choreoId={choreoId} editable />
                  </div>
                  {/*<PreviewSlideList choreoId={this.props.choreoId} />*/}
                </Sider>
                <SidePanel
                  choreoId={this.props.choreoId}
                  placement={this.state.placement}
                  closable={true}
                  onClose={this.onClose}
                  visible={this.state.visible}
                  mask={false}
                  id={this.state.sidePanelID}
                  width={200}
                />
              </Layout>
            </Layout>
          </Spin>
        </MinTablet>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  const choreoId = props.match.params.choreoId;
  const choreo = getChoreo(state, choreoId);
  if (choreo) {
    const activeFormation = choreo.formations[state.UI.activeFormation];
    return {
      choreoId: choreoId,
      formationId: state.UI.activeFormation,
      choreoName: choreo.name,
      formationName: activeFormation.name,
      animated: state.UI.animated
    }
  } else {
    const emptyChoreo = getChoreo(state, "empty");
    const emptyFormation = emptyChoreo.formations[0];
    return {
      choreoId: 'empty',
      formationId: 0,
      choreoName: emptyChoreo.name,
      formationName: emptyFormation.name,
      animated: false
    }
  }
}

// Auth exists
const authCondition = (authUser) => !!authUser;
const failRoute = '/';

export default withAuthorization(authCondition, failRoute)(withFireStoreSync(true, true)(connect(mapStateToProps)(FormationScreen)));
