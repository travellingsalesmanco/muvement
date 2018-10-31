import React, { Fragment, PureComponent } from 'react';
import { Circle, Text } from 'react-konva';

class DancerDot extends PureComponent {
  render() {
    const { radius, number, name, onSelect } = this.props;
    // console.log(name, " dot rendered");
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
          fontSize={12}
          fontFamily={"Sen-Bold"}
          onClick={onSelect ? (e) => onSelect(e, name) : undefined}
          onTap={onSelect ? (e) => onSelect(e, name) : undefined}
        />
      </Fragment>
    );
  }
}

export default DancerDot;
