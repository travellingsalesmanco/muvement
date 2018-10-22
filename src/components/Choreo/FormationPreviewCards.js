import { Card, Col, Icon, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { addAndSetActiveFrame, gotoFrame } from "../../actions/danceActions";
import ResponsiveStageCanvas from '../StageCanvas/ResponsiveStageCanvas';
import './ChoreoHomeScreen.css';

class FormationPreviewCards extends React.Component {
  clickHandler = (index) => {
    if (index === 0) {
      this.props.dispatch(addAndSetActiveFrame(this.props.danceId, this.props.frames.length));
      this.props.history.push(`${this.props.match.url}/frame`)
    } else {
      this.props.dispatch(gotoFrame(this.props.danceId, index - 1));
      this.props.history.push(`${this.props.match.url}/frame`)
    }
  };

  render() {
    const frames = this.props.frames.slice();
    // Prepend "New FormationCard" to start of array of cards
    frames.unshift({ name: "" });
    return (
      <div>
        {
          frames.map((formation, index) => {
            if (index % 2 === 0) {
              return (
                <Row gutter={60} type='flex' justify='center' key={index}>
                  <Col span={11}>
                    <Card
                      hoverable
                      bordered={false}
                      className="formation-card"
                      onClick={() => this.clickHandler(index)}
                    >
                      {
                        index === 0
                          ? <div className="new-formation"
                            ref={node => {
                              this.container = node;
                            }}>
                            <Icon type="file-add" className="add-formation-icon" />
                            <span className="add-formation-title"> ADD FORMATION </span>
                          </div>
                          : <div className="ant-formation-card-cover" style={{ pointerEvents: "None" }}>
                            <ResponsiveStageCanvas danceId={this.props.danceId} frameId={index - 1} />
                          </div>
                      }
                      <div className="formation-name">
                        <span>{formation.name}</span>
                      </div>
                    </Card>
                  </Col>

                  {
                    frames[index + 1]
                      ?
                      <Col span={11}>
                        <Card
                          hoverable
                          bordered={false}
                          className="formation-card"
                          onClick={() => this.clickHandler(index + 1)}
                        >
                          <div className="ant-formation-card-cover" style={{ pointerEvents: "None" }}>
                            <ResponsiveStageCanvas danceId={this.props.danceId} frameId={index} />
                          </div>
                          <div className="formation-name">
                            <span>{frames[index + 1].name}</span>
                          </div>
                        </Card>
                      </Col>
                      : <Col span={11} />
                  }
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
