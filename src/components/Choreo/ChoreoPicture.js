import React from 'react';
import {Row, Col, Card, Icon} from 'antd';
import './ChoreoHomeScreen.css';
import ImageAddIcon from "../../icons/ImageAddIcon";
import GradientSVG from '../../icons/GradientSVG';

class ChoreoPicture extends React.Component {
  clickHandler = () => {
    console.log("clicked")
  };
  render() {
    return (
      <div>
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
          <Card
            bordered={false}
            className="choreo-picture-card">
            <div className="add-choreo-pic">
              <ImageAddIcon className="add-choreo-pic-icon"/>
            </div>
          </Card>
      </div>
    );
  }
}

export default ChoreoPicture;
