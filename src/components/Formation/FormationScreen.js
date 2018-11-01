import { Button, Input, Layout, Spin } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { addAndSetActiveFormation, removeFormation } from "../../actions/choreoActions";
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

class FormationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      visible: false,
      sidePanelID: 0,
      formationName: '',
      activeButton: props.animated ? 3 : 2
    }
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
  }

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
    const { activeButton } = this.state;
    const { loading } = this.props;
    return (
      <Fragment>
        <MobilePortrait>
          <Layout className="mp-body" style={{ minHeight: '100vh', height: '100%' }}>
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
            <Layout style={{ backgroundColor: 'transparent' }}>
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Spin indicator={loadingIcon} spinning={loading}>
                  <SectionTitle key={this.props.formationName} mobile={true} formationName={this.props.formationName}
                                handleEditName={this.handleEditName}
                                handleEditNameConfirm={this.handleEditNameConfirm} />
                  <div className="stage-canvas" style={{ height: '15rem', marginBottom: '25px' }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                           withGrid animated={this.props.animated} />
                  </div>
                  <div style={{ overflowY: 'scroll' }}>
                    <MobileSwitchTabs activeButton={activeButton} handleClick={this.handleClick} />
                    {
                      activeButton === 1 &&
                      <Fragment>
                        <div className="horizontal-list" style={{ overflowX: 'scroll', marginTop: '1em' }}>
                          <HorizontalSlideList />
                        </div>
                        <div className="formationscreen-buttons">
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{
                              paddingTop: '0.5em',
                              paddingRight: '0.5em',
                              paddingBottom: '1em',
                              paddingLeft: '1em',
                              flex: 1
                            }}>
                              <Button type={"default"} icon="plus" ghost block style={{ borderRadius: '1em' }}
                                      onClick={this.handleAddFormation}>Add</Button>
                            </div>
                            <div style={{
                              paddingTop: '0.5em',
                              paddingRight: '2em',
                              paddingBottom: '1em',
                              paddingLeft: '0.5em',
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
                      <div style={{ padding: '1em 2em', fontSize: '1.2em' }}>
                        <PerformerList choreoId={this.props.choreoId} />
                      </div>
                    }
                    {
                      activeButton === 3 &&
                        <ShowView choreoId={this.props.choreoId}/>
                    }
                  </div>
                </Spin>
              </Content>
            </Layout>
          </Layout>
        </MobilePortrait>

        <MobileLandscape>
          <Spin indicator={loadingIcon} spinning={loading}>
            <Layout className="body" style={{height: '100vh'}}>
              <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
              <div style={{ background: '#000', flex: 1, overflow: "hidden" }}>

                <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                       withGrid animated={this.props.animated} />
              </div>
            </Layout>
          </Spin>
        </MobileLandscape>

        <MinTablet>
          <Layout className="body">
            <GradientSVG
              startColor="#24c6dc"
              endColor="#514a9d"
              idCSS="cool-gradient"
            />
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
            <Layout className="contents">
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Spin indicator={loadingIcon} spinning={loading}>
                  <SectionTitle key={this.props.formationName} formationName={this.props.formationName}
                                handleEditName={this.handleEditName}
                                handleEditNameConfirm={this.handleEditNameConfirm} />
                  <div className="formationscreen-stage"
                       style={{ background: '#000', height: '30em', overflow: "hidden" }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId} editable
                                           withGrid animated={this.props.animated} />
                  </div>
                </Spin>
              </Content>
              <Sider width={'12rem'} className="sider">
                <Spin indicator={loadingIcon} spinning={loading}>
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
                    <VerticalSlideList />
                  </div>
                  {/*<PreviewSlideList choreoId={this.props.choreoId} />*/}
                </Spin>
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
        </MinTablet>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  const choreoId = props.match.params.choreoId;
  const choreo = getChoreo(state, choreoId)
  const activeFormation = choreo.formations[state.UI.activeFormation];
  return {
    choreoId: choreoId,
    formationId: state.UI.activeFormation,
    choreoName: choreo.name,
    formationName: activeFormation.name,
    animated: state.UI.animated
  }
}

// Auth exists
const authCondition = (authUser) => !!authUser;
const failRoute = '/';

export default withAuthorization(authCondition, failRoute)(withFireStoreSync(true)(connect(mapStateToProps)(FormationScreen)));
