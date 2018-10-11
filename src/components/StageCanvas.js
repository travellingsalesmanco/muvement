import React, {Component} from 'react';
import {Circle, Layer, Stage, Group, Text, Label, Tag, Path} from "react-konva";

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
    return (
      <Stage preventDefault={true} width={this.props.width} height={this.props.height}
             scaleX={this.state.scale}
             scaleY={this.state.scale}>
        <Layer>
          {this.state.dancers.map((dancer, key) => (
            <Group
              key={key}
              draggable
            >
              <Circle
                x={dancer.position[0]}
                y={dancer.position[1]}
                fill={'#24c6dc'}
                radius={CIRCLE_RADIUS}
              />
              <Text
                x={dancer.position[0] - CIRCLE_RADIUS}
                y={dancer.position[1] - CIRCLE_RADIUS}
                width={CIRCLE_RADIUS * 2}
                height={CIRCLE_RADIUS * 2}
                align={'center'}
                verticalAlign={'middle'}
                fill={'white'}
                text={key + 1}
              />
              <Label
                // TODO: fix magic numbers around label size
                x={dancer.position[0] - (this.state.labelWidth ? (this.state.labelWidth[key] + 20) / 2 : 50)}
                y={dancer.position[1] - CIRCLE_RADIUS * 2 - 40}
              >
                <Tag
                  fill={'#24c6dc'}
                  lineJoin={'round'}
                  cornerRadius={10}
                />
                {this.state.labelWidth ?
                  <Text
                    width={this.state.labelWidth ? this.state.labelWidth[key] + 20 : 100}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={20}
                    padding={10}
                    align={'left'}
                  />
                  :
                  <Text
                    ref={ref => (this.nameLabels[key] = ref)}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={20}
                    padding={15}
                    align={'left'}
                  />
                }
                <Path
                  x={this.state.labelWidth ? this.state.labelWidth[key] - 10 : 80}
                  y={7}
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