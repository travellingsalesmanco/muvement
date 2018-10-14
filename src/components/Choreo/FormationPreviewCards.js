import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import './ChoreoHomeScreen.css';
import {BrowserRouter as Link, withRouter} from "react-router-dom";

class FormationPreviewCards extends React.Component {
    clickHandler = () => {
      console.log("clicked")
    };
    render() {
      const data = this.props.data.slice();
      // Prepend "New FormationCard" to start of array of cards
      data.unshift({ name: "" });
      console.log(this.props.match);
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
                        onClick={this.clickHandler}
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
                              onClick={() => this.props.history.push(`${this.props.match.url}/frame/${index + 1}`)}
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

export default withRouter(FormationPreviewCards);
