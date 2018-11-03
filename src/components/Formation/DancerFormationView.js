import { Button, Layout, Spin } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { LOAD_ANIMATED_VIEW, UNLOAD_ANIMATED_VIEW } from '../../constants/actionTypes';
import GradientSVG from "../../icons/GradientSVG";
import HeadphoneIcon from "../../icons/HeadphoneIcon";
import { loadingIcon } from "../../icons/LoadingIcon";
import UserAddIcon from "../../icons/UserAddIcon";
import { getChoreo } from '../../selectors/choreo';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import withFireStoreSync from "../withFirestoreSync";
import './DancerFormationView.css';
import HorizontalSlideList from "./HorizontalSlideList";
import Navigation from "./Navigation";
import VerticalSlideList from "./VerticalSlideList";
import ShowView from './ShowView';
import DancerPerformerList from "./DancerView/DancerPerformerList";

const SectionTitle = ({ mobile, formationName }) => (
  <div className="section-title-container">
    <div className="section-title" style={{ margin: mobile ? '1rem 2rem' : '2rem' }}>
      <div className="section-title-inner">
        {formationName ?
          <span>{formationName}</span>
          : <span>Untitled</span>
        }
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
      PLAY
    </button>
  </div>
);

class FormationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placement: 'right',
      formationName: '',
      tabletSideActiveId: 1,
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

  handleViewPerformers = () => {
    this.setState({
      tabletSideActiveId: 1
    });
  };

  handleViewFormations = () => {
    this.setState({
      tabletSideActiveId: 2
    });
  };

  render() {
    const { Content, Sider } = Layout;
    const { activeButton, tabletSideActiveId } = this.state;
    const { loading } = this.props;
    return (
      <Fragment>
        <MobilePortrait>
          <Layout className="mp-body" style={{ minHeight: '100vh', height: '100%' }}>
            <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
            <Layout style={{ backgroundColor: 'transparent' }}>
              <Content style={{ display: "flex", flexDirection: "column" }}>
                <Spin indicator={loadingIcon} spinning={loading}>
                  <SectionTitle key={this.props.formationName} mobile={true} formationName={this.props.formationName} />
                  <div className="stage-canvas" style={{ height: '15rem', marginBottom: '25px' }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId}
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
                      </Fragment>
                    }
                    {
                      activeButton === 2 &&
                      <div style={{ padding: '1em 2em', fontSize: '1.2em' }}>
                        <DancerPerformerList choreoId={this.props.choreoId} />
                      </div>
                    }
                    {
                      activeButton === 3 &&
                      <ShowView choreoId={this.props.choreoId} />
                    }
                  </div>
                </Spin>
              </Content>
            </Layout>
          </Layout>
        </MobilePortrait>

        <MobileLandscape>
          <Spin indicator={loadingIcon} spinning={loading}>
            <Layout className="body" style={{ height: '100vh' }}>
              <Navigation title={this.props.choreoName} history={this.props.history} choreoId={this.props.choreoId} />
              <div style={{ background: '#000', flex: 1, overflow: "hidden" }}>

                <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId}
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
                  <SectionTitle key={this.props.formationName} formationName={this.props.formationName} />
                  <div className="formationscreen-stage"
                       style={{ background: '#000', height: '30em', overflow: "hidden" }}>
                    <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={this.props.formationId}
                                           withGrid animated={this.props.animated} />
                  </div>
                </Spin>
              </Content>
              <Sider width={'12rem'} className="sider">
                <Spin indicator={loadingIcon} spinning={loading}>
                  <div className="button-container">
                    <Button className="sider-button" shape="circle" onClick={this.handleViewPerformers}>
                      <UserAddIcon style={{ fontSize: '33px' }} />
                    </Button>
                    <Button className="sider-button" shape="circle" onClick={this.handleViewFormations}>
                      <HeadphoneIcon style={{ fontSize: '25px' }} />
                    </Button>
                  </div>
                  {tabletSideActiveId === 1 &&
                  <Fragment>
                    <h3 className="slide-list-title">Track Performers</h3>
                    <div style={{ overflowY: 'scroll', height: `calc(100vh - 234px)` }}>
                      <DancerPerformerList choreoId={this.props.choreoId} />
                    </div>
                  </Fragment>
                  }
                  {tabletSideActiveId === 2 &&
                  <Fragment>
                    <h3 className="slide-list-title">All Formations</h3>
                    <div style={{ overflowY: 'scroll', height: `calc(100vh - 234px)` }}>
                      <VerticalSlideList />
                    </div>
                  </Fragment>
                  }
                  {/*<PreviewSlideList choreoId={this.props.choreoId} />*/}
                </Spin>
              </Sider>
            </Layout>
          </Layout>
        </MinTablet>
      </Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  const choreoId = props.match.params.choreoId;
  const choreo = getChoreo(state, choreoId);
  const activeFormation = choreo.formations[state.UI.activeFormation];
  return {
    choreoId: choreoId,
    formationId: state.UI.activeFormation,
    choreoName: choreo.name,
    formationName: activeFormation.name,
    animated: state.UI.animated
  }
}

export default withFireStoreSync(true)(connect(mapStateToProps)(FormationScreen));
