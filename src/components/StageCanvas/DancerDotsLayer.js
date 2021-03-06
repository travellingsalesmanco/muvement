import React, { PureComponent } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { moveDancer, removeDancerFromFormation } from '../../actions/formationActions';
import { DESELECT_DANCER, SELECT_DANCER } from '../../constants/actionTypes';
import { makeDancersLayoutSelector } from '../../selectors/layout';
import { absoluteToRelativeX, absoluteToRelativeY, generateDotRadius } from '../../lib/stageUtils';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';


class DancerDotsLayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDancer: null
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    // this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.bindWithinCanvas = this.bindWithinCanvas.bind(this)
  }

  bindWithinCanvas(pos) {
    const maxX = this.props.width - this.props.dotRadius;
    const maxY = this.props.height - this.props.dotRadius;
    const minX = this.props.dotRadius;
    const minY = this.props.dotRadius;
    let { x: newX, y: newY } = pos;
    if (pos.x < minX) {
      newX = minX;
    } else if (pos.x > maxX) {
      newX = maxX;
    }
    if (pos.y < minY) {
      newY = minY;
    } else if (pos.y > maxY) {
      newY = maxY;
    }
    return {
      x: newX,
      y: newY
    }
  }

  handleDragEnd(e, dancerName) {
    e.cancelBubble = true;
    const newDancerPosition = [
      absoluteToRelativeX(e.target.x(), this.props.stageRect),
      absoluteToRelativeY(e.target.y(), this.props.stageRect)
    ];
    this.props.dispatch(moveDancer(this.props.choreoId, this.props.formationId, dancerName, newDancerPosition));
  };

  handleSelect(e, dancerName) {
    e.cancelBubble = true;
    if (this.props.selectedDancers.includes(dancerName)) {
      this.props.dispatch({ type: DESELECT_DANCER, payload: dancerName })
    } else {
      this.props.dispatch({ type: SELECT_DANCER, payload: dancerName })
    }
  };

  isSelected(name) {
    return this.props.selectedDancers.includes(name);
  }

  isAnySelected() {
    return this.props.selectedDancers.length > 0;
  }

  // handleRemove(e, dancerName) {
  //   e.cancelBubble = true;
  //   console.log("Remove dancer: " + dancerName);
  //   this.props.dispatch(removeDancerFromFormation(this.props.choreoId, this.props.formationId, dancerName));
  // };

  render() {
    const { dotRadius, dancersLayout, editable, showLabels, preview } = this.props;
    return (
      <Layer>
        {dancersLayout.map((dancerLayout) => {
          const boundPos = this.bindWithinCanvas(dancerLayout.position);
          return (
            <Group
              key={dancerLayout.name}
              x={boundPos.x}
              y={boundPos.y}
              draggable={editable || preview}
              dragBoundFunc={this.bindWithinCanvas}
              onDragEnd={(e) => !preview && this.handleDragEnd(e, dancerLayout.name)}
            >
              <DancerDot radius={dotRadius} number={dancerLayout.id}
                         name={dancerLayout.name}
                         onSelect={editable ? this.handleSelect : undefined}
                         selected={this.isSelected(dancerLayout.name)} isAnySelected={this.isAnySelected()} />
              {
                showLabels && !preview
                  ? <DancerLabel name={dancerLayout.name} dotRadius={dotRadius} />
                  : null
              }
            </Group>
          )
        })}
      </Layer>
    )
  }
}


const makeMapStateToProps = () => {
  const getDancersLayout = makeDancersLayoutSelector();
  return (state, props) => {
    return {
      dancersLayout: getDancersLayout(state, props),
      selectedDancers: state.UI.selectedDancers,
      dotRadius: generateDotRadius(props.width, props.height),
      showLabels: state.UI.showLabels
    }
  }
};
export default connect(makeMapStateToProps)(DancerDotsLayer);