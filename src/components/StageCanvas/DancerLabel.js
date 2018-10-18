import React, { PureComponent } from 'react';
import { Circle, Label, Path, Tag, Text } from 'react-konva';

class DancerLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      labelWidth: 0,
      labelHeight: 0
    };
  }
  componentDidMount() {
    this.setState({
      labelWidth: this.textLabel.getWidth(),
      labelHeight: this.textLabel.getHeight()
    })
  }

  render() {
    const { name, handleRemove } = this.props;
    // console.log(name, " label rendered");
    const radius = 15;
    const iconSize = 26;
    const fontSize = 15;
    const textPadding = 10;
    return (
      <Label
        x={-(this.state.labelWidth ? (this.state.labelWidth + iconSize) / 2 : 0)}
        y={-(this.state.labelHeight ? radius + this.state.labelHeight + textPadding : 0)}
      >
        <Tag
          fill={'#24c6dc'}
          lineJoin={'round'}
          cornerRadius={10}
        />
        {this.state.labelWidth ?
          <Text
            ref={ref => { this.textLabel = ref }}
            width={this.state.labelWidth + iconSize + 10}
            fill={'white'}
            text={name}
            fontSize={fontSize}
            padding={textPadding}
            align={'left'}
          />
          :
          // Used in initial render to calculate size of text box before addition of icon
          <Text
            ref={ref => { this.textLabel = ref }}
            fill={'white'}
            text={name}
            fontSize={fontSize}
            padding={textPadding}
            align={'left'}
          />
        }
        <Circle
          x={this.state.labelWidth ? this.state.labelWidth + iconSize / 2 : 0}
          y={this.state.labelHeight ? this.state.labelHeight / 2 : 0}
          radius={iconSize / 2}
          fill={'#24c6dc'}
          strokeWidth={0}
          onClick={(e) => handleRemove(e, name)}
          onTap={(e) => handleRemove(e, name)}
        />
        <Path
          x={this.state.labelWidth ? this.state.labelWidth : 0}
          y={(fontSize + textPadding * 2 - iconSize) / 2}
          data={'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z'}
          fill={'white'}
          scaleX={0.05}
          scaleY={0.05}
          onClick={(e) => handleRemove(e, name)}
          onTap={(e) => handleRemove(e, name)}
        />
      </Label>
    );
  }
}

export default DancerLabel;