import React from 'react';
import {Button, Input, Layout, Modal} from 'antd';
import AddPerformerScreen from "./AddPerformerScreen";
import {connect} from 'react-redux';
import ChoreoListScreen from "./ChoreoListScreen";

class HomeScreen extends React.Component {
  state = {
    addChoreoState: false,
    modalVisible: false,
    newChoreoName: ''
  };

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
      <Layout className="body" style={{overflowY: 'scroll', overflowX: 'hidden'}}>
        {
          this.state.addChoreoState
            ? <AddPerformerScreen choreoName={this.state.newChoreoName} match={this.props.match}/>
            : <ChoreoListScreen setModalVisible={this.setModalVisible}/>
        }
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
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    dances: state.dances
  }
};

export default connect(mapStateToProps)(HomeScreen);