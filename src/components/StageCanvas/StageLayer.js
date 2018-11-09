import React, { PureComponent, Fragment } from 'react';
import { Layer, Rect, Line, Text } from 'react-konva';

class StageLayer extends PureComponent {
  render() {
    // console.log("stage rendered");
    const { layout } = this.props;
    const midPoint = {
      x: layout.width / 2 + layout.tl.x,
      y: layout.height / 2 + layout.tl.y,
    }
    return (
      <Layer>
        <Rect width={layout.width} height={layout.height} x={layout.tl.x} y={layout.tl.y}
          stroke={"#514a9d"} strokeWidth={3} />
        {
          this.props.showMarkings ?
            <Fragment>
              <Line points={[midPoint.x, midPoint.y - 5, midPoint.x, midPoint.y + 5]} stroke={"white"} opacity={0.5} />
              <Line points={[midPoint.x - 5, midPoint.y, midPoint.x + 5, midPoint.y]} stroke={"white"} opacity={0.5} />
              <Text x={midPoint.x - 100} y={layout.height + layout.tl.y - 10}
                width={200}
                align={"center"} text={"Stage Front"} fill={"white"} opacity={0.5} />
            </Fragment>
            : null
        }
      </Layer>
    );
  }
}
export default StageLayer;