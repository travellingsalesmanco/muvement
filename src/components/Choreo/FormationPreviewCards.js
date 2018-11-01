import { Card, Col, Icon, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { addAndSetActiveFormation, gotoFormation, removeFormation } from "../../actions/choreoActions";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import './ChoreoHomeScreen.css';

class FormationPreviewCards extends React.Component {
  handleClick = (index) => {
    if (!this.props.editState) {
      if (index === 0) {
        this.props.dispatch(addAndSetActiveFormation(this.props.choreoId, this.props.formations.length));
        this.props.history.push(`${this.props.match.url}/formation`)
      } else {
        this.props.dispatch(gotoFormation(this.props.choreoId, index - 1));
        this.props.history.push(`${this.props.match.url}/formation`)
      }
    }
  };

  handleRemove = (index) => {
    if (this.props.editState) {
      this.props.dispatch(removeFormation(this.props.choreoId, index - 1));
    }
  };

  render() {
    const formations = this.props.formations.slice();
    // Prepend "New FormationCard" to start of array of cards
    formations.unshift({ name: "" });
    return (
      <div>
        {
          formations.map((formation, index) => {
            if (index % 2 === 0) {
              return (
                <Row gutter={60} type='flex' justify='center' key={index}>
                  <Col span={11}>
                    {
                      index === 0
                      ? <div className="formation-card">
                          <div className="new-formation" ref={node => { this.container = node; }}>
                            <Icon type="file-add" className="add-formation-icon" />
                            <span className="add-formation-title"> ADD FORMATION </span>
                          </div>
                        </div>
                      : <div className="formation-card">
                          <div onClick={() => this.handleClick(index)}>
                            {
                              this.props.editState &&
                              <span>
                                <Icon type="minus-circle" theme="outlined"
                                      className={'delete-button'} onClick={() => this.handleRemove(index)}/>
                              </span>
                            }
                            <div className="ant-formation-card-cover" style={{ pointerEvents: "None" }}>
                              <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index - 1} />
                            </div>
                          </div>
                          <div className="formation-name">
                            <span>{formation.name}</span>
                          </div>
                        </div>
                    }
                  </Col>
                  <Col span={11}>
                  {
                    formations[index + 1]
                      ?
                      <div className="formation-card">
                        <div onClick={() => this.handleClick(index + 1)}>
                          {
                            this.props.editState &&
                            <span>
                              <Icon type="minus-circle" theme="outlined"
                                    className={'delete-button'} onClick={() => this.handleRemove(index + 1)}/>
                            </span>
                          }
                          <div className="ant-formation-card-cover" style={{ pointerEvents: "None" }}>
                            <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index} />
                          </div>
                        </div>
                        <div className="formation-name">
                          <span>{formations[index + 1].name}</span>
                        </div>
                      </div>
                      : null
                  }
                  </Col>
                </Row>
              );
            }
          })
        }
      </div>
    );
  }
}
export default withRouter(connect()(FormationPreviewCards));
