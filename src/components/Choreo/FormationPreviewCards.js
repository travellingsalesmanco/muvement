import { Card, Col, Icon, Row } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import { addAndSetActiveFrame, gotoFrame } from "../../actions/danceActions";
import StageCanvas from "../StageCanvas/StageCanvas";
import './ChoreoHomeScreen.css';

class FormationPreviewCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 100,
      stageHeight: 100,
    }
  }
  clickHandler = (index) => {
    if (index === 0) {
      this.props.dispatch(addAndSetActiveFrame(this.props.danceId, this.props.frames.length));
      this.props.history.push(`${this.props.match.url}/frame`)
    } else {
      this.props.dispatch(gotoFrame(this.props.danceId, index - 1));
      this.props.history.push(`${this.props.match.url}/frame`)
    }
  };
  componentDidMount() {
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    if (this.state.stageWidth !== this.container.offsetWidth || this.state.stageHeight !== this.container.offsetHeight) {
      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
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
                          : <div className="ant-formation-card-cover">
                            <div style={{ flex: 1, pointerEvents: "None" }}>
                              <StageCanvas danceId={this.props.danceId} frameId={index - 1} width={this.state.stageWidth}
                                height={this.state.stageHeight} />
                            </div>
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
                          <div className="ant-formation-card-cover">
                            <div style={{ flex: 1, pointerEvents: "None" }}>
                              <StageCanvas danceId={this.props.danceId} frameId={index + 1 - 1} width={this.state.stageWidth}
                                height={this.state.stageHeight} />
                            </div>
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

export default withRouter(FormationPreviewCards);
