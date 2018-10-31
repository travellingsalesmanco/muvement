import React, { Component } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { generateDotRadius } from '../../lib/stageUtils';
import { getAnimatedLayout } from '../../selectors/layout';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';

class AnimatedDancerDotsLayer extends Component {
  render() {
    const { dotRadius, showLabels, layout, elapsedTime } = this.props;
    return (
      <Layer>
        {
          layout.map((dancerLayout) => {
            const currPos = dancerLayout.position(elapsedTime);
            const visible = dancerLayout.visible(elapsedTime);
            if (visible) {
              return (
                <Group key={dancerLayout.name} x={currPos.x} y={currPos.y}>
                  <DancerDot radius={dotRadius} number={dancerLayout.id} name={dancerLayout.name} />
                  {
                    showLabels
                      ? <DancerLabel name={dancerLayout.name} />
                      : null
                  }
                </Group>
              )
            } else {
              return null
            }
          })
        }
      </Layer>
    );

  }

}

const mapStateToProps = (state, props) => {
  return {
    dotRadius: generateDotRadius(props.width, props.height),
    showLabels: state.UI.showLabels,
    layout: getAnimatedLayout(state, props),
    elapsedTime: state.UI.elapsedTime
  }
};

export default connect(mapStateToProps)(AnimatedDancerDotsLayer);