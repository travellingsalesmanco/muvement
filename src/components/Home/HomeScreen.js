import { Button, Input, Layout, Modal } from 'antd';
import React, { Fragment } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { addChoreo } from "../../actions/choreoActions";
import { defaultDancers, defaultFormation, defaultStageDim } from "../../constants/defaults";
import { genDummyImage } from "../../constants/dummyData";
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import './ChoreoCards.css';
import ChoreoListScreen from "./ChoreoListScreen";

class HomeScreen extends React.Component {
  state = {
    modalVisible: false,
    newChoreoName: ''
  };

  componentDidMount() {
    ReactGA.pageview('Dashboard');
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible });
  };

  handleNewChoreoName = e => {
    this.setState({
      newChoreoName: e.target.value,
    });
  };

  handleNewChoreo = () => {
    if (this.state.newChoreoName !== '') {
      this.setState({
        // addChoreoState: true,
        modalVisible: false,
      }, () => {
        this.props.dispatch(addChoreo(null, {
          name: this.state.newChoreoName,
          stageDim: defaultStageDim,
          dancers: defaultDancers,
          formations: [defaultFormation],
          imageUrl: genDummyImage(this.state.newChoreoName),
        })).then(finalAction => this.props.history.push(`/choreo/${finalAction.choreoId}/formation`))
      });

    }
  };

  render() {
    return (
      <Fragment>
      <MobilePortrait>
      <Layout className="mp-dashboard-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <ChoreoListScreen setModalVisible={this.setModalVisible}/>
      </Layout>
        <Modal
          centered
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          footer={null}
          className="mp-new-choreo-modal"
        >
          <div className="mp-new-choreo-modal-inner">
            <h3>NEW STAGE NAME</h3>
            <Input
              placeholder="Enter formation name"
              value={this.state.newChoreoName}
              onChange={this.handleNewChoreoName}
              autoFocus={true}
            />
            <Button block onClick={this.handleNewChoreo}>START</Button>
          </div>
        </Modal>
      </MobilePortrait>

      <MobileLandscape>
      <Layout className="dashboard-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <ChoreoListScreen setModalVisible={this.setModalVisible}/>
      </Layout>
        <Modal
          centered
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          footer={null}
          className="ml-new-choreo-modal"
        >
          <div className="ml-new-choreo-modal-inner">
            <h3>NEW STAGE NAME</h3>
            <Input
              placeholder="Enter formation name"
              value={this.state.newChoreoName}
              onChange={this.handleNewChoreoName}
              autoFocus={true}
            />
            <Button block onClick={this.handleNewChoreo}>START</Button>
          </div>
        </Modal>
      </MobileLandscape>

      <MinTablet>
      <Layout className="dashboard-body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        <ChoreoListScreen setModalVisible={this.setModalVisible}/>
      </Layout>
        <Modal
          centered
          visible={this.state.modalVisible}
          onCancel={() => this.setModalVisible(false)}
          footer={null}
          className="new-choreo-modal"
        >
          <div className="new-choreo-modal-inner">
            <h3>NEW STAGE NAME</h3>
            <Input
              placeholder="Enter formation name"
              value={this.state.newChoreoName}
              onChange={this.handleNewChoreoName}
              autoFocus={true}
            />
            <Button block onClick={this.handleNewChoreo}>START</Button>
          </div>
        </Modal>
      </MinTablet>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    choreos: state.choreos
  }
};

export default connect(mapStateToProps)(HomeScreen);
