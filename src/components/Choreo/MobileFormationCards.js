import { Button, Card, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { addAndSetActiveFormation, gotoFormation } from "../../actions/choreoActions";
import { REMOVE_FORMATION } from "../../constants/actionTypes";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import './MobileFormationCards.css';

class MobileFormationCards extends React.Component {
  clickHandler = (index) => {
    if (this.props.editState) {
      this.props.dispatch({
        type: REMOVE_FORMATION,
        choreoId: this.props.choreoId,
        formationId: index
      })
    } else {
      this.props.dispatch(gotoFormation(this.props.choreoId, index));
      this.props.history.push(`${this.props.match.url}/formation`)
    }
  };
  handleAddFormation = () => {
    this.props.dispatch(addAndSetActiveFormation(this.props.choreoId, this.props.formations.length));
    // this.props.history.push(`${this.props.match.url}/formation`)
  };
  render() {
    return (
      <div>
        <div style={{padding: '0 1em'}}>
        <Button type={"default"} icon={"plus"} ghost block className="mobile-formation-add-button"
                onClick={this.handleAddFormation}>Add Formation</Button>
        </div>
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
                {
                  this.props.editState &&
                  <span onClick={() => this.handleRemoveFormation(index)}>
                    <Icon type="minus-circle" theme="outlined"
                          className={'delete-button'}/>
                  </span>
                }
                <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index} />
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
