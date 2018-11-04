import { Modal, Button, Icon } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { publishChoreo, removeChoreo, unpublishChoreo } from "../../actions/choreoActions";
import { getChoreo } from '../../selectors/choreo';
import './ChoreoCards.css';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

const confirm = Modal.confirm;

const PublishedView = ({ link }) => (
  <Fragment>
    <h3>Share with your performers!</h3>
    <p className="publish-link">{link}</p>
  </Fragment>
);


class ChoreoCard extends PureComponent {
  state = {
    publishModalVisible: false,
    publishLoading: false,
  };

  handleClick = () => {
    this.props.history.push(`/choreo/${this.props.choreoId}/formation`);
  };

  handleRemove = () => {
    this.showConfirm();
  };

  handlePublishToggle = () => {
    this.setState({
        publishLoading: true
      }, () => {
        this.props.published
          ? this.props.dispatch(unpublishChoreo(this.props.choreoId))
          : this.props.dispatch(publishChoreo(this.props.choreoId));
        this.setState({
          publishLoading: false
        })
      }
    )
  };

  handleClose = () => {
    this.setState({
      publishModalVisible: false
    })
  };

  handleShow = () => {
    this.setState({
      publishModalVisible: true
    })
  };

  showConfirm = () => {
    const onOk = () => {
      return new Promise((resolve, reject) => {
        this.props.dispatch(removeChoreo(this.props.choreoId))
          .then(() => {
            setTimeout(resolve, 500);
          });
      }).catch((e) => {
        console.log(e)
      });
    };
    confirm({
      title: 'Do you want to delete this choreography?',
      centered: true,
      onOk,
      onCancel() {
      },
    });
  };

  render() {
    const { name, imageUrl, formationLength, published, publishedLink } = this.props;
    const { publishModalVisible, publishLoading } = this.state;
    console.log(published);
    return (
      <Fragment>
        <MobilePortrait>
          <div className="mp-choreo-card">
            <div>
              <div className="mp-ant-card-cover" onClick={this.handleClick}>
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="mp-description">
                <span>{name}</span>
                <div className="mp-description-inner">
                  <span id="mp-formation-no">{formationLength} formations</span>
                  <div className="icons">
                    <Icon type="share-alt" theme="outlined" onClick={this.handleShow} />
                    <Icon type="delete" theme="outlined" onClick={this.handleRemove} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            centered
            visible={publishModalVisible}
            onCancel={this.handleClose}
            footer={null}
            className="publish-modal"
          >
            <div className="publish-modal-inner">
              {published
                ? <PublishedView link={publishedLink} />
                : <h3>Click 'Publish' below to share with your performers!</h3>
              }
              <Button block
                      onClick={this.handlePublishToggle}
                      loading={publishLoading}
              >
                {published ? 'Cancel Publish' : 'Publish'}
              </Button>
            </div>
          </Modal>
        </MobilePortrait>

        <MobileLandscape>
          <div className="choreo-card">
            <div>
              <div className="ant-card-cover" onClick={this.handleClick}>
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="description">
                <span>{name}</span>
                <div className="description-inner">
                  <span id="formation-no">{formationLength} formations</span>
                  <div className="icons">
                    <Icon type="share-alt" theme="outlined" onClick={this.handleShow} />
                    <Icon type="delete" theme="outlined" onClick={this.handleRemove} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            centered
            visible={publishModalVisible}
            onCancel={this.handleClose}
            footer={null}
            className="publish-modal"
          >
            <div className="publish-modal-inner">
              {published
                ? <PublishedView link={publishedLink} />
                : <h3>Click 'Publish' below to share with your performers!</h3>
              }
              <Button block
                      onClick={this.handlePublishToggle}
                      loading={publishLoading}
              >
                {published ? 'Cancel Publish' : 'Publish'}
              </Button>
            </div>
          </Modal>
        </MobileLandscape>

        <MinTablet>
          <div className="choreo-card">
            <div>
              <div className="ant-card-cover" onClick={this.handleClick}>
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="description">
                <span>{name}</span>
                <div className="description-inner">
                  <span id="formation-no">{formationLength} formations</span>
                  <div className="icons">
                    <Icon type="share-alt" theme="outlined" onClick={this.handleShow} />
                    <Icon type="delete" theme="outlined" onClick={this.handleRemove} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            centered
            visible={publishModalVisible}
            onCancel={this.handleClose}
            footer={null}
            className="publish-modal"
          >
            <div className="publish-modal-inner">
              {published
                ? <PublishedView link={publishedLink} />
                : <h3>Click 'Publish' below to share with your performers!</h3>
              }
              <Button block
                      onClick={this.handlePublishToggle}
                      loading={publishLoading}
              >
                {published ? 'Cancel Publish' : 'Publish'}
              </Button>
            </div>
          </Modal>
        </MinTablet>

      </Fragment>
    );
  }
}

const makeMapStateToProps = () => {
  return (state, props) => {
    const choreo = getChoreo(state, props.choreoId)
    return {
      name: choreo.name,
      imageUrl: choreo.imageUrl,
      formationLength: choreo.formations.length,
      published: choreo.published,
      //TODO: change when deployed
      publishedLink: "localhost:3000/choreoview/" + props.choreoId
    }
  }
};
export default withRouter(connect(makeMapStateToProps)(ChoreoCard));
