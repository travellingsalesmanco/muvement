import { Button, Card, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { addAndSetActiveFormation, gotoFormation, removeFormation } from "../../actions/choreoActions";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import './MobileFormationCards.css';

class MobileFormationCards extends React.Component {
  handleClick = (index) => {
    if (!this.props.editState) {
      this.props.dispatch(gotoFormation(this.props.choreoId, index));
      this.props.history.push(`${this.props.match.url}/formation`);
    }
  };

  handleAddFormation = () => {
    this.props.dispatch(addAndSetActiveFormation(this.props.choreoId, this.props.formations.length))
      .then(() => {
        const scrollToIndex = this.props.formations.length - 1;
        document.getElementById(scrollToIndex.toString()).scrollIntoView({
          behavior: 'smooth'
        });
    });
  };

  handleRemove = (index) => {
    if (this.props.editState) {
      this.props.dispatch(removeFormation(this.props.choreoId, index));
    }
  };

  render() {
    return (
      <div>
        <div className="mobile-formation-add" style={{padding: '0 1em'}}>
        <Button type={"default"} icon={"plus"} block className="mobile-formation-add-button"
                onClick={this.handleAddFormation}>Create New Formation</Button>
        </div>
      {
        this.props.formations.map((formation, index) => (
          <div key={index} id={index} className="mobile-formation-card">
            <div className="mobile-formation-card-cover">
              <div style={{width: '40%', padding: '0 2em'}}>
                <div className="mobile-formation-name">
                  <span>{index + 1}. {formation.name}</span>
                </div>
              </div>
              <div onClick={() => this.handleClick(index)}>
                {
                  this.props.editState &&
                  <span>
                      <Icon type="minus-circle" theme="outlined"
                            className={"delete-button"} onClick={() => this.handleRemove(index)}/>
                    </span>
                }
                <div className="mobile-formation-preview-container">
                  <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index} />
                </div>
              </div>
            </div>
          </div>
        ))
      }
      </div>
    );
  }
}
export default withRouter(connect()(MobileFormationCards));
