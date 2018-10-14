import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import './ChoreoCards.css';
import FileAddIcon from "../../icons/FileAddIcon";
import GradientSVG from '../../icons/GradientSVG';

class ChoreoCards extends React.Component {
  clickHandler = () => {
    console.log("clicked")
  };
  render() {
    const data = this.props.data.slice();
    // Prepend "New Card" to start of array of cards
    data.unshift({ name: "New Choreography" });
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
                      onClick={this.clickHandler}
                    >
                        {
                          index === 0
                          ? <div className="new-choreo">
                              <FileAddIcon className="new-choreo-icon"/>
                            </div>
                          : <div className="ant-card-cover">
                              <img alt="Cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
                            </div>
                        }
                      <div className="description">
                        <span>{card.name}</span>
                        <div className="description">
                          <span id="card-date">20 Oct 2018</span>
                          <Icon type="share-alt" theme="outlined" style={{fontSize: '20px'}}/>
                        </div>
                      </div>
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
                          >
                            <div className="ant-card-cover">
                              <img alt="Cover" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>
                            </div>
                            <div className="description">
                              <span>{data[index + 1].name}</span>
                              <div className="description">
                                <span id="card-date">20 Oct 2018</span>
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

export default ChoreoCards;
