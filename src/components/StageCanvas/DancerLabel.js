import React, { PureComponent } from 'react';
import { Group, Circle, Text, Label, Tag, Path } from 'react-konva';

class DancerLabel extends PureComponent {
  render() {
    // const {dancerId, x, y, labelWidth} = this.props;
    // return (
      // <Label
      //   x={-(this.state.labelWidth ? (this.state.labelWidth[key] + iconSize) / 2 : 50)}
      //   y={-radius * 2 - fontSize - textPadding * 2}
      //   visible={this.state.isDancerSelected[key]}
      // >
      //   <Tag
      //     fill={'#24c6dc'}
      //     lineJoin={'round'}
      //     cornerRadius={10}
      //   />
      //   {this.state.labelWidth ?
      //     <Text
      //       width={this.state.labelWidth ? this.state.labelWidth[key] + iconSize + 10 : 100}
      //       fill={'white'}
      //       text={dancer.name}
      //       fontSize={fontSize}
      //       padding={textPadding}
      //       align={'left'}
      //     />
      //     :
      //     // Used in initial render to calculate size of text box before addition of icon
      //     <Text
      //       ref={ref => (this.nameLabels[key] = ref)}
      //       fill={'white'}
      //       text={dancer.name}
      //       fontSize={fontSize}
      //       padding={textPadding}
      //       align={'left'}
      //     />
      //   }
      //   <Path
      //     x={this.state.labelWidth ? this.state.labelWidth[key] : 80}
      //     y={(fontSize + textPadding * 2 - iconSize) / 2}
      //     data={'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z'}
      //     fill={'white'}
      //     scaleX={0.05}
      //     scaleY={0.05}
      //     onClick={(e) => this.handleRemove(e, dancerId)}
      //     onTap={(e) => this.handleRemove(e, dancerId)}
      //   />
      // </Label>
    // );
    return null;
  }
}

export default DancerLabel;