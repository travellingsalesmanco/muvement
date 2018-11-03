import React, { PureComponent } from 'react';
import { Text } from 'react-konva';

class DancerLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      labelWidth: 0,
      labelHeight: 0
    };
  }

  wrapToMaxWidth() {
    // Arbitrary max width allowance
    let maxWidth = this.props.dotRadius * 15;
    console.log("Limiting width to: ", maxWidth);
    this.setState({
      labelWidth: this.textLabel.getWidth() < maxWidth ? this.textLabel.getWidth() : maxWidth,
      labelHeight: this.textLabel.getHeight()
    });
  }

  componentDidMount() {
    this.wrapToMaxWidth();
  }

  componentDidUpdate() {
    this.wrapToMaxWidth();
  }

  render() {
    const { name, dotRadius } = this.props;
    // console.log(name, " label rendered");
    const fontSize = 15;
    const textPadding = 5;
    return (
      this.state.labelWidth ?
        <Text
          ref={ref => {
            this.textLabel = ref
          }}
          x={-(this.state.labelWidth ? this.state.labelWidth / 2 : 0)}
          y={-(this.state.labelHeight ? dotRadius + this.state.labelHeight : 0)}
          fill={'white'}
          text={name}
          fontSize={fontSize}
          padding={textPadding}
          width={this.state.labelWidth}
          height={this.state.labelHeight}
          wrap={"none"}
          ellipsis
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