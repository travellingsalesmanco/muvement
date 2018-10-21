import { Card } from 'antd';
import React, { PureComponent } from 'react';
import FileAddIcon from '../../icons/FileAddIcon';
import './ChoreoCards.css';

class NewChoreoCard extends PureComponent {
  render() {
    return (
      <Card
        hoverable
        bordered={false}
        className="choreo-card"
        onClick={this.props.onClick}
      >
        <div className="new-choreo">
          <FileAddIcon className="new-choreo-icon" />
          <span className="add-choreo-title"> CREATE A NEW STAGE </span>
        </div>
      </Card>

    )
  }
}

export default NewChoreoCard;