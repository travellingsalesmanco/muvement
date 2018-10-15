import React, { PureComponent } from 'react';
import { Layer, Line } from 'react-konva';
import { connect } from 'react-redux';
import { makeGridLayoutSelector } from '../../selectors/layout';

class GridLayer extends PureComponent {
  render() {
    console.log("grid rendered")
    return (
      <Layer>
        {
          this.props.gridLayout
            .map((points, key) => <Line key={key} points={points} stroke={"#514a9d"} opacity={0.5} />)
        }
      </Layer>
    );
  }
}
const makeMapStateToProps = () => {
  const getGridLayout = makeGridLayoutSelector();
  return (state, props) => {
    return {
      gridLayout: getGridLayout(state, props),
    }
  }
};

export default connect(makeMapStateToProps)(GridLayer)