import { Col, Row } from 'antd';
import React from 'react';
import GradientSVG from '../../icons/GradientSVG';
import ChoreoCard from './ChoreoCard';
import './ChoreoCards.css';
import NewChoreoCard from './NewChoreoCard';

class ChoreoCardList extends React.Component {
  render() {
    const [first, ...rest] = this.props.data;
    return (
      <div>
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
        <Row gutter={72} type='flex' justify='center'>
          <Col span={10}>
            <NewChoreoCard onClick={() => this.props.setModalVisible(true)} />
          </Col>
          <Col span={10}>
            {first !== undefined ? <ChoreoCard danceId={first} /> : null}
          </Col>
        </Row>
        {
          rest.map((danceId, index) => {
            if (index % 2 === 0) {
              return (
                <Row gutter={72} type='flex' justify='center' key={danceId}>
                  <Col span={10}>
                    <ChoreoCard danceId={danceId} />
                  </Col>
                  <Col span={10}>
                    {rest[index + 1] ? <ChoreoCard danceId={danceId} /> : null}
                  </Col>
                </Row>
              );
            } else {
              return null
            }
          })
        }
      </div>
    );
  }
}


export default ChoreoCardList;
