import React, { PureComponent, Fragment } from 'react';
import { Layer, Rect, Line, Text } from 'react-konva';
import Cross from './Cross';

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
              <Cross x={midPoint.x} y={midPoint.y} radius={5} stroke={"white"} opacity={0.5} />
              <Cross x={layout.tl.x + layout.width / 4} y={midPoint.y} radius={4} stroke={"white"} opacity={0.3} />
              <Cross x={layout.tl.x + layout.width * 3 / 4} y={midPoint.y} radius={4} stroke={"white"} opacity={0.3} />
              <Cross x={midPoint.x} y={layout.tl.y + layout.height / 4} radius={4} stroke={"white"} opacity={0.3} />
              <Cross x={midPoint.x} y={layout.tl.y + layout.height * 3 / 4} radius={4} stroke={"white"} opacity={0.3} />
              <Text x={midPoint.x - 100} y={layout.height + layout.tl.y + 5}
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