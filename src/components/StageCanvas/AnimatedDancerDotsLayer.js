import React, { Component } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { generateDotRadius } from '../../lib/stageUtils';
import { getAnimatedLayout } from '../../selectors/layout';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';

class AnimatedDancerDotsLayer extends Component {

  isSelected(name) {
    return this.props.selectedDancers.includes(name);
  }

  isAnySelected() {
    return this.props.selectedDancers.length > 0;
  }

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
                  <DancerDot radius={dotRadius} number={dancerLayout.id}
                             name={dancerLayout.name}
                             selected={this.isSelected(dancerLayout.name)} isAnySelected={this.isAnySelected()} />
                  {
                    showLabels
                      ? <DancerLabel name={dancerLayout.name} dotRadius={dotRadius} />
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
    selectedDancers: state.UI.selectedDancers,
    layout: getAnimatedLayout(state, props),
    elapsedTime: state.UI.elapsedTime
  }
};

export default connect(mapStateToProps)(AnimatedDancerDotsLayer);