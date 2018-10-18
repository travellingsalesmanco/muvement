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
    const { name } = this.props;
    // console.log(name, " label rendered");
    const radius = 15;
    const fontSize = 15;
    const textPadding = 5;
    return (
      this.state.labelWidth ?
        <Text
          ref={ref => {
            this.textLabel = ref
          }}
          x={-(this.state.labelWidth ? this.state.labelWidth / 2 : 0)}
          y={-(this.state.labelHeight ? radius + this.state.labelHeight : 0)}
          fill={'white'}
          text={name}
          fontSize={fontSize}
          padding={textPadding}
        />
        :
        // Used in initial render to calculate size of text box before addition of icon
        <Text
          ref={ref => {
            this.textLabel = ref
          }}
          fill={'white'}
          text={name}
          fontSize={fontSize}
          padding={textPadding}
          align={'left'}
        />
    )
  }
}

export default DancerLabel;