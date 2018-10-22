import { Card, Icon } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getChoreo } from '../../selectors/choreo';
import './ChoreoCards.css';

class ChoreoCard extends PureComponent {
  clickHandler() {
    this.props.history.push(`/choreo/${this.props.choreoId}`);
  }
  render() {
    const { name, formationLength } = this.props;

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
              <span id="card-date">{formationLength} formations</span>
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
    const choreo = getChoreo(state, props.choreoId)
    return {
      name: choreo.name,
      formationLength: choreo.formations.length
    }
  }
}
export default withRouter(connect(makeMapStateToProps)(ChoreoCard));