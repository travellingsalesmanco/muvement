import React, { PureComponent } from 'react';
import { Layer, Rect } from 'react-konva';

class StageLayer extends PureComponent {
  render() {
    // console.log("stage rendered");
    const { layout } = this.props;
    return (
      <Layer>
        <Rect width={layout.width} height={layout.height} x={layout.tl.x} y={layout.tl.y}
          stroke={"#514a9d"} strokeWidth={3} />
      </Layer>
    );
  }
}
export default StageLayer;