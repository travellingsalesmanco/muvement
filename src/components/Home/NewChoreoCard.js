import { Card } from 'antd';
import React, { PureComponent, Fragment } from 'react';
import FileAddIcon from '../../icons/FileAddIcon';
import './ChoreoCards.css';
import { MinTablet, MobileLandscape, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class NewChoreoCard extends PureComponent  {
  render() {
    return (
    <Fragment>
    <MobilePortrait>
      <Card
        hoverable
        bordered={false}
        className="mp-choreo-card"
        onClick={this.props.onClick}
      >
        <div className="mp-new-choreo">
          <FileAddIcon className="mp-new-choreo-icon" />
          <span className="mp-add-choreo-title"> CREATE A NEW PERFORMANCE </span>
        </div>
      </Card>
    </MobilePortrait>

    <MobileLandscape>
      <Card
        hoverable
        bordered={false}
        className="choreo-card"
        onClick={this.props.onClick}
      >
        <div className="new-choreo">
          <FileAddIcon className="new-choreo-icon" />
          <span className="add-choreo-title"> CREATE A NEW PERFORMANCE </span>
        </div>
      </Card>
    </MobileLandscape>

    <MinTablet>
      <Card
        hoverable
        bordered={false}
        className="choreo-card"
        onClick={this.props.onClick}
      >
        <div className="new-choreo">
          <FileAddIcon className="new-choreo-icon" />
          <span className="add-choreo-title"> CREATE A NEW PERFORMANCE </span>
        </div>
      </Card>
    </MinTablet>
    </Fragment>
    )
  }
}

export default NewChoreoCard;
