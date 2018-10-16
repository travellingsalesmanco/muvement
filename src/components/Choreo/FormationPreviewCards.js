import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import './ChoreoHomeScreen.css';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {addAndSetActiveFrame, gotoFrame} from "../../actions/danceActions";

class FormationPreviewCards extends React.Component {
    clickHandler = (index) => {
      if (index === 0) {
        this.props.dispatch(addAndSetActiveFrame(this.props.danceId, this.props.lastFrameIndex + 1));
        this.props.history.push(`${this.props.match.url}/frame`)
      } else {
        this.props.dispatch(gotoFrame(this.props.danceId, index - 1));
        this.props.history.push(`${this.props.match.url}/frame`)
      }
    };
    render() {
      const data = this.props.data.slice();
      // Prepend "New FormationCard" to start of array of cards
      data.unshift({ name: "" });
      return (
          <div>
          {
            data.map((card, index) => {
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
                            ? <div className="new-formation">
                                <Icon type="file-add" className="add-formation-icon"/>
                                <span className="add-formation-title"> Add Formation </span>
                              </div>
                            : <div className="ant-formation-card-cover">
                                <img alt="Cover" className="formation-image" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
                              </div>
                          }
                        <div className="formation-name">
                          <span>{card.name}</span>
                        </div>
                      </Card>
                    </Col>

                    {
                      data[index + 1]
                        ?
                          <Col span={11}>
                            <Card
                              hoverable
                              bordered={false}
                              className="formation-card"
                              onClick={() => this.clickHandler(index + 1)}
                            >
                              <div className="ant-formation-card-cover">
                                <img alt="Cover" className="formation-image"  src="https://www.allkpop.com/upload/2018/09/af_org/01133025/red-velvet.jpg"/>
                              </div>
                              <div className="formation-name">
                                <span>{data[index + 1].name}</span>
                              </div>
                            </Card>
                          </Col>
                        : <Col span={11}/>
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

function mapStateToProps(state) {
  const activeDance = state.dances[state.UI.activeDance];
  return {
    danceId: state.UI.activeDance,
    lastFrameIndex: activeDance.frames.length - 1,
  }
}

export default withRouter(connect(mapStateToProps)(FormationPreviewCards));
