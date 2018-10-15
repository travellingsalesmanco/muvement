import React, { Fragment, PureComponent } from 'react';
import { Circle, Text } from 'react-konva';

class DancerDot extends PureComponent {
  render() {
    const { radius, number, name, onSelect } = this.props;
    console.log(name, " dot rendered");
    return (
      <Fragment>
        <Circle
          fill={'#24c6dc'}
          radius={radius}
        />
        <Text
          x={-radius}
          y={-radius}
          width={radius * 2}
          height={radius * 2}
          align={'center'}
          verticalAlign={'middle'}
          fill={'white'}
          text={number}
          onDblClick={(e) => onSelect(e, name)}
          onDblTap={(e) => onSelect(e, name)}
        />
      </Fragment>
    );
  }
}

export default DancerDot;