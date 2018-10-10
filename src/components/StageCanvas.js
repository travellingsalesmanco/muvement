import React, {Component} from 'react';
import {Circle, Layer, Stage} from "react-konva";

class StageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dancers: [
        {
          name: "Bob",
          position: [500, 450]
        },
        {
          name: "Marley",
          position: [600, 450]
        },
        {
          name: "And",
          position: [500, 550]
        },
        {
          name: "Me",
          position: [600, 550]
        }
      ],
      scale: Math.min(
        this.props.width / 1000,
        this.props.height / 1000
      )
    }
  }


  render() {
    return (
      <Stage preventDefault={true} width={this.props.width} height={this.props.height}
             scaleX={this.state.scale}
             scaleY={this.state.scale}>
        <Layer>
          {this.state.dancers.map((dancer, key) => (
            <Circle
              key={key}
              radius={10}
              x={dancer.position[0]}
              y={dancer.position[1]}
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