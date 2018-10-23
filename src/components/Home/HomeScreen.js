import React, {Fragment} from 'react';
import {Button, Input, Layout, Modal} from 'antd';
import AddPerformerScreen from "./AddPerformerScreen";
import {connect} from 'react-redux';
import ChoreoListScreen from "./ChoreoListScreen";
import ReactGA from 'react-ga';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";
import './ChoreoCards.css';

class HomeScreen extends React.Component {
  state = {
    addChoreoState: false,
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
        addChoreoState: true,
        modalVisible: false,
      });
    }
  };

  render() {
    return (
      <Fragment>
      <Layout className="body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        {
          this.state.addChoreoState
            ? <AddPerformerScreen choreoName={this.state.newChoreoName} match={this.props.match}/>
            : <ChoreoListScreen setModalVisible={this.setModalVisible}/>
        }
      </Layout>
      <MobilePortrait>
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
            />
            <Button block onClick={this.handleNewChoreo}>START</Button>
          </div>
        </Modal>
      </MobilePortrait>

      <MobileLandscape>
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
            />
            <Button block onClick={this.handleNewChoreo}>START</Button>
          </div>
        </Modal>
      </MobileLandscape>

      <MinTablet>
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
