import React, { PureComponent } from 'react';
import { Text } from 'react-konva';

class Timestamps extends PureComponent {
  generateTimestamps() {
    let divisions = [];
    for (let i = 0; i <= this.props.duration; i += this.props.interval) {
      divisions.push(i)
    }
    return divisions
  }
  render() {
    const divisions = this.generateTimestamps();
    return (
      divisions.map(division => {
        const pos = division * this.props.msWidth;
        const minutes = Math.floor(division / 60000);
        let [seconds] = ((division % 60000) / 1000).toString().split(".");
        if (seconds.length === 1) {
          seconds = "0" + seconds
        }
        return <Text
          key={division}
          x={pos}
          y={0}
          fill={'white'}
          fontFamily={"Sen-bold"}
          text={minutes + ":" + seconds}
          fontSize={12}
        />
      })
    );
  }
}
export default Timestamps;