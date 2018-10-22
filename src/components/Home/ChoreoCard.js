import { Card, Icon } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getDance } from '../../selectors/dance';
import './ChoreoCards.css';

class ChoreoCard extends PureComponent {
  clickHandler() {
    this.props.history.push(`/choreo/${this.props.danceId}`);
  }
  render() {
    const { name, frameLength } = this.props;

    return (
      <Card
        hoverable
        bordered={false}
        className="choreo-card"
        onClick={() => this.clickHandler()}
      >
        <div>
          <div className="ant-card-cover">
            <img alt="Cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          </div>
          <div className="description">
            <span>{name}</span>
            <div className="description-inner">
              <span id="card-date">{frameLength} formations</span>
              <Icon type="share-alt" theme="outlined" style={{ fontSize: '20px' }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
const makeMapStateToProps = () => {
  return (state, props) => {
    const dance = getDance(state, props.danceId)
    return {
      name: dance.name,
      frameLength: dance.frames.length
    }
  }
}
export default withRouter(connect(makeMapStateToProps)(ChoreoCard));