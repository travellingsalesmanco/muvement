import React from 'react';
import {Row, Col, Card, Icon, Modal, Input, Button} from 'antd';
import './ChoreoCards.css';
import connect from "react-redux/es/connect/connect";
import {gotoDance} from "../../actions/danceActions";
import FileAddIcon from "../../icons/FileAddIcon";
import GradientSVG from '../../icons/GradientSVG';
import {withRouter} from "react-router-dom";

class ChoreoCards extends React.Component {
  clickHandler = (index) => {
    if (index === 0) { // because new-choreo is prepended
      this.props.setModalVisible(true);
    } else {
      this.props.dispatch(gotoDance(index - 1));
      this.props.history.push(`/choreo/${index - 1}`);
    }
  };

  render() {
    const data = this.props.data.slice();
    // Prepend "New Card" to start of array of cards
    data.unshift({ name: "" });
    console.log(data);
    return (
      <div>
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
        {
          data.map((card, index) => {
            if (index % 2 === 0) {
              return (
                <Row gutter={72} type='flex' justify='center' key={index}>
                  <Col span={10}>
                    <Card
                      hoverable
                      bordered={false}
                      className="choreo-card"
                      onClick={() => this.clickHandler(index)}
                    >
                        {
                          index === 0
                          ? <div className="new-choreo">
                              <FileAddIcon className="new-choreo-icon"/>
                              <span class="add-choreo-title"> CREATE A NEW STAGE </span>
                            </div>
                          :
                             <div>
                              <div className="ant-card-cover">
                                <img alt="Cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
                              </div>
                              <div className="description">
                                <span>{card.name}</span>
                                <div className="description">
                                  <span id="card-date">30 formations</span>
                                  <Icon type="share-alt" theme="outlined" style={{fontSize: '20px'}}/>
                                </div>
                              </div>
                          </div>
                        }

                    </Card>
                  </Col>
                  {
                    data[index + 1]
                      ?
                        <Col span={10}>
                          <Card
                            hoverable
                            bordered={false}
                            className="choreo-card"
                            onClick={() => this.clickHandler(index + 1)}
                          >
                              <div className="ant-card-cover">
                                <img alt="Cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
                              </div>

                            <div className="description">
                              <span>{data[index + 1].name}</span>
                              <div className="description">
                                <span id="card-date">12 formations</span>
                                <Icon type="share-alt" theme="outlined" style={{fontSize: '20px'}}/>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      : <Col span={10}/>
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

const mapStateToProps = state => {
  return {
  }
};

export default withRouter(connect(mapStateToProps)(ChoreoCards));
