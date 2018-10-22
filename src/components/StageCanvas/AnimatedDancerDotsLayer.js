import React, { Component } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { generateDotRadius } from '../../lib/stageUtils';
import { getAnimatedLayout, getFormationRelativeElapsedTime } from '../../selectors/layout';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';

class AnimatedDancerDotsLayer extends Component {
  render() {
    const { dotRadius, showLabels, layout, elapsed, formationId } = this.props;
    return (
      <Layer>
        {layout[formationId].map((dancerLayout) => {
          const currPos = dancerLayout.position(elapsed);
          return (
            <Group
              key={dancerLayout.name}
              x={currPos.x}
              y={currPos.y}
            >
              <DancerDot radius={dotRadius} number={dancerLayout.id} name={dancerLayout.name} />
              {
                showLabels
                  ? <DancerLabel name={dancerLayout.name} />
                  : null
              }
            </Group>
          )
        })}
      </Layer>
    );

  }

}

const mapStateToProps = (state, props) => {
  return {
    dotRadius: generateDotRadius(props.width, props.height),
    showLabels: state.UI.showLabels,
    isPlaying: state.UI.isPlaying,
    layout: getAnimatedLayout(state, props),
    elapsed: getFormationRelativeElapsedTime(state, props)
  }
};

export default connect(mapStateToProps)(AnimatedDancerDotsLayer);