import { Card } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { gotoFormation } from "../../actions/danceActions";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import './MobileFormationCards.css';

class MobileFormationCards extends React.Component {
  clickHandler = (index) => {
    this.props.dispatch(gotoFormation(this.props.danceId, index));
    this.props.history.push(`${this.props.match.url}/formation`)
  };
  render() {
    return (
      <div>
      {
        this.props.formations.map((formation, index) => (
          <Card
            key={index}
            hoverable
            bordered={false}
            className="mobile-formation-card"
            onClick={() => this.clickHandler(index)}
          >
            <div className="mobile-formation-card-cover">
              <div style={{width: '40%', padding: '0 2em'}}>
                <div className="mobile-formation-name">
                  <span>{index + 1}. {formation.name}</span>
                </div>
              </div>
              <div className="mobile-formation-preview-container">
                <ResponsiveStageCanvas danceId={this.props.danceId} formationId={index} />
              </div>
            </div>
          </Card>
        ))
      }
      </div>
    );
  }
}
export default withRouter(connect()(MobileFormationCards));
