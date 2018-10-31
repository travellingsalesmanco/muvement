import React, { PureComponent } from 'react';
import { Layer, Line } from 'react-konva';

class GridLayer extends PureComponent {
  render() {
    // console.log("grid rendered");
    return (
      <Layer>
        {
          this.props.grid
            .map((points, key) => <Line key={key} dash={[5, 2]} points={points} stroke={"#514a9d"} opacity={0.5} />)
        }
      </Layer>
    );
  }
}
export default GridLayer;
