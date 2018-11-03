import React, { Fragment, PureComponent } from 'react';
import { Circle, Text } from 'react-konva';

class DancerDot extends PureComponent {
  render() {
    const { radius, number, name, onSelect, selected, isAnySelected } = this.props;
    // console.log(name, " dot rendered");
    const circleFill = (selected || !isAnySelected) ? '#24c6dc' : 'white';
    const textFill = (selected || !isAnySelected) ? 'white' : '#24c6dc';
    return (
      <Fragment>
        <Circle
          fill={circleFill}
          radius={radius}
        />
        <Text
          x={-radius}
          y={-radius}
          width={radius * 2}
          height={radius * 2}
          align={'center'}
          verticalAlign={'middle'}
          fill={textFill}
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
