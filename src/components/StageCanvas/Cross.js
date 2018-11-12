import React, { PureComponent, Fragment } from 'react';
import { Line } from 'react-konva';

class Cross extends PureComponent {
  render() {
    const { x, y, radius, stroke, opacity } = this.props;
    return (
      <Fragment>
        <Line points={[x, y - radius, x, y + radius]} stroke={stroke} opacity={opacity} />
        <Line points={[x - radius, y, x + radius, y]} stroke={stroke} opacity={opacity} />
      </Fragment>
    );
  }
}

export default Cross;