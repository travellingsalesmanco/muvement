import React, {Component} from 'react';
import {Circle, Layer, Stage, Line, Rect, Group, Text, Label, Tag, Path} from "react-konva";
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
    };
    this.nameLabels = [];
  }

  componentDidMount() {
    this.setState({
      labelWidth: this.nameLabels.map(textLabel => {
        return textLabel.getWidth()
      })
    });
  }

  render() {
    const CIRCLE_RADIUS = 15;
    const ICON_SIZE = 26;
    const FONT_SIZE = 20;
    const TEXT_PADDING = 10;
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

    let absoluteX = (origX) => {
      return origX * stageRect.width + stageRect.tl.x;
    };

    let absoluteY = (origY) => {
      return origY * stageRect.height + stageRect.tl.y;
    };

    return (
      <Stage preventDefault={true} width={canvasWidth} height={canvasHeight}>
        {gridLayer}
        {stageLayer}
        <Layer>
          {this.state.dancers.map((dancer, key) => (
            <Group
              key={key}
              radius={10}
              fill={'#24c6dc'}
              draggable
            >
              <Circle
                x={absoluteX(dancer.position[0])}
                y={absoluteY(dancer.position[1])}
                fill={'#24c6dc'}
                radius={CIRCLE_RADIUS}
              />
              <Text
                x={absoluteX(dancer.position[0]) - CIRCLE_RADIUS}
                y={absoluteY(dancer.position[1]) - CIRCLE_RADIUS}
                width={CIRCLE_RADIUS * 2}
                height={CIRCLE_RADIUS * 2}
                align={'center'}
                verticalAlign={'middle'}
                fill={'white'}
                text={key + 1}
              />
              <Label
                x={absoluteX(dancer.position[0]) - (this.state.labelWidth ? (this.state.labelWidth[key] + ICON_SIZE) / 2 : 50)}
                y={absoluteY(dancer.position[1]) - CIRCLE_RADIUS * 2 - FONT_SIZE - TEXT_PADDING * 2}
              >
                <Tag
                  fill={'#24c6dc'}
                  lineJoin={'round'}
                  cornerRadius={10}
                />
                {this.state.labelWidth ?
                  <Text
                    width={this.state.labelWidth ? this.state.labelWidth[key] + ICON_SIZE + 10 : 100}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={FONT_SIZE}
                    padding={TEXT_PADDING}
                    align={'left'}
                  />
                  :
                  // Used in initial render to calculate size of text box before addition of icon
                  <Text
                    ref={ref => (this.nameLabels[key] = ref)}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={FONT_SIZE}
                    padding={TEXT_PADDING}
                    align={'left'}
                  />
                }
                <Path
                  x={this.state.labelWidth ? this.state.labelWidth[key] : 80}
                  y={(FONT_SIZE + TEXT_PADDING * 2 - ICON_SIZE) / 2}
                  data={'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z'}
                  fill={'white'}
                  scaleX={0.05}
                  scaleY={0.05}
                />
              </Label>
            </Group>

          ))}
        </Layer>
      </Stage>
    );
  }
}

export default StageCanvas;