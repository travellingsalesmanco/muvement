import { Card, Icon } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { removeChoreo } from "../../actions/choreoActions";
import { getChoreo } from '../../selectors/choreo';
import './ChoreoCards.css';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class ChoreoCard extends PureComponent {
  handleClick = () => {
    if (!this.props.editState) {
      this.props.history.push(`/choreo/${this.props.choreoId}`);
    }
  };

  handleRemove = () => {
    if (this.props.editState) {
      this.props.dispatch(removeChoreo(this.props.choreoId));
    }
  };

  render() {
    const { name, imageUrl, formationLength } = this.props;

    return (
      <Fragment>
        <MobilePortrait>
          <div className="mp-choreo-card">
            <div>
              <div className="mp-ant-card-cover" onClick={this.handleClick}>
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'} onClick={this.handleRemove}/>
                  </span>
                }
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="mp-description">
                <span>{name}</span>
                <div className="mp-description-inner">
                  <span id="mp-formation-no">{formationLength} formations</span>
                  <Icon type="share-alt" theme="outlined" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>
        </MobilePortrait>

        <MobileLandscape>
          <div className="choreo-card">
            <div>
              <div className="ant-card-cover" onClick={this.handleClick}>
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'} onClick={this.handleRemove}/>
                  </span>
                }
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="description">
                <span>{name}</span>
                <div className="description-inner">
                  <span id="formation-no">{formationLength} formations</span>
                  <Icon type="share-alt" theme="outlined" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>
        </MobileLandscape>

        <MinTablet>
          <div className="choreo-card">
            <div>
              <div className="ant-card-cover" onClick={this.handleClick}>
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'} onClick={this.handleRemove}/>
                  </span>
                }
                <img alt="Cover" src={imageUrl} />
              </div>
              <div className="description">
                <span>{name}</span>
                <div className="description-inner">
                  <span id="formation-no">{formationLength} formations</span>
                  <Icon type="share-alt" theme="outlined" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>
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
      formationLength: choreo.formations.length
    }
  }
}
export default withRouter(connect(makeMapStateToProps)(ChoreoCard));
