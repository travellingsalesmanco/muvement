import React, { Component } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { advanceNextFrame } from '../../actions/timelineActions';
import { generateDotRadius } from '../../lib/stageUtils';
import { getFrameRelativeElapsedTime, getTimeline } from '../../selectors/layout';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';

class AnimatedDancerDotsLayer extends Component {
  render() {
    const { dotRadius, showLabels, timeline, elapsed, danceId, frameId, playing } = this.props;
    const dancersLayout = timeline.layouts[frameId];
    if (playing) {
      this.props.dispatch(advanceNextFrame(danceId, frameId, timeline.cumDuration[frameId], timeline.totalDuration))
    }
    return (
      <Layer>
        {dancersLayout.map((dancerLayout) => {
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
    timeline: getTimeline(state, props),
    elapsed: getFrameRelativeElapsedTime(state, props)
  }
};

export default connect(mapStateToProps)(AnimatedDancerDotsLayer);