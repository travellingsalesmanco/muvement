import React, {Component} from 'react';
import {Circle, Layer, Line, Rect, Stage} from "react-konva";
import {calculateStageDimensions, generateGrid} from "./stageUtils";

class StageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {
        width: 9.6,
        height: 5.18,
        unit: 'm'
      },
      dancers: [
        {
          name: "Bob",
          position: [0.5, 0.5]
        },
        {
          name: "Marley",
          position: [0.1, 0.1]
        },
        {
          name: "And",
          position: [0.9, 0.9]
        },
        {
          name: "Me",
          position: [0.1, 0.9]
        },
        {
          name: "John",
          position: [0.9, 0.1]
        }
      ]
    }
  }

  render() {
    // Canvas dimensions
    let {width: canvasWidth, height: canvasHeight} = this.props;
    let stageRect = calculateStageDimensions(canvasWidth, canvasHeight,
      this.state.dimensions.width, this.state.dimensions.height, 0.05);

    console.log("Stage: ", canvasWidth, canvasHeight);

    let gridLayer = (
      <Layer>
        {
          generateGrid(canvasWidth, canvasHeight, 0.05 * canvasWidth)
            .map((points, key) => <Line key={key} points={points} stroke={"#514a9d"} opacity={0.5}/>)
        }
      </Layer>
    );
    let stageLayer = (
      <Layer>
        <Rect width={stageRect.width} height={stageRect.height} x={stageRect.tl.x} y={stageRect.tl.y}
              stroke={"#514a9d"} strokeWidth={3}/>
      </Layer>
    );
    return (
      <Stage preventDefault={true} width={canvasWidth} height={canvasHeight}>
        {gridLayer}
        {stageLayer}
        <Layer>
          {this.state.dancers.map((dancer, key) => (
            <Circle
              key={key}
              radius={10}
              x={dancer.position[0] * stageRect.width + stageRect.tl.x}
              y={dancer.position[1] * stageRect.height + stageRect.tl.y}
              fill={'#24c6dc'}
              draggable
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}

export default StageCanvas;