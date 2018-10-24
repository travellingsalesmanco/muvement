import { Card, Icon } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { removeChoreo } from "../../actions/choreoActions";
import { getChoreo } from '../../selectors/choreo';
import './ChoreoCards.css';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class ChoreoCard extends PureComponent {
  clickHandler() {
    if (this.props.editState) {
      this.props.dispatch(removeChoreo(this.props.choreoId))
    } else {
      this.props.history.push(`/choreo/${this.props.choreoId}`);
    }
  }

  render() {
    const { name, imageUrl, formationLength } = this.props;

    return (
      <Fragment>
        <MobilePortrait>
          <Card
            hoverable
            bordered={false}
            className="mp-choreo-card"
            onClick={() => this.clickHandler()}
          >
            <div>
              <div className="mp-ant-card-cover">
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'}/>
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
          </Card>
        </MobilePortrait>

        <MobileLandscape>
          <Card
            hoverable
            bordered={false}
            className="choreo-card"
            onClick={() => this.clickHandler()}
          >
            <div>
              <div className="ant-card-cover">
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'}/>
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
          </Card>
        </MobileLandscape>

        <MinTablet>
          <Card
            hoverable
            bordered={false}
            className="choreo-card"
            onClick={() => this.clickHandler()}
          >
            <div>
              <div className="ant-card-cover">
                {
                  this.props.editState &&
                  <span>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'}/>
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
          </Card>
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
