import React, { PureComponent } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { moveDancer, removeDancerFromFrame } from '../../actions/frameActions';
import { DESELECT_DANCER, SELECT_DANCER } from '../../constants/actionTypes';
import { makeDancersLayoutSelector } from '../../selectors/layout';
import { absoluteToRelativeX, absoluteToRelativeY } from '../stageUtils';
import DancerDot from './DancerDot';
import DancerLabel from './DancerLabel';


class DancerDotsLayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDancer: null
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.bindWithinCanvas = this.bindWithinCanvas.bind(this)
  }
  
  bindWithinCanvas(pos) {
    let newX = pos.x;
    let newY = pos.y;
    if (pos.x < 0) {
      newX = 0;
    } else if (pos.x > this.props.width) {
      newX = this.props.width;
    }
    if (pos.y < 0) {
      newY = 0;
    } else if (pos.y > this.props.height) {
      newY = this.props.height;
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
    this.props.dispatch(moveDancer(this.props.danceId, this.props.frameId, dancerName, newDancerPosition));
  };

  handleSelect(e, dancerName) {
    e.cancelBubble = true;
    if (this.props.selectedDancers.includes(dancerName)) {
      this.props.dispatch({ type: DESELECT_DANCER, payload: dancerName })
    } else {
      this.props.dispatch({ type: SELECT_DANCER, payload: dancerName })
    }
  };

  handleRemove(e, dancerName) {
    e.cancelBubble = true;
    console.log("Remove dancer: " + dancerName);
    this.props.dispatch(removeDancerFromFrame(this.props.danceId, this.props.frameId, dancerName));
  };

  render() {
    const { editable } = this.props;
    const CIRCLE_RADIUS = 15;
    return (
      <Layer>
        {this.props.dancersLayout.map((dancerLayout) => {
          const boundPos = this.bindWithinCanvas(dancerLayout.position);
          return (
            <Group
              key={dancerLayout.name}
              x={boundPos.x}
              y={boundPos.y}
              draggable={editable}
              dragBoundFunc={this.bindWithinCanvas}
              onDragEnd={(e) => this.handleDragEnd(e, dancerLayout.name)}
            >
              <DancerDot radius={CIRCLE_RADIUS} number={dancerLayout.id}
                name={dancerLayout.name} onSelect={editable ? this.handleSelect : undefined} />
              {
                editable && dancerLayout.selected
                  ? <DancerLabel name={dancerLayout.name} handleRemove={this.handleRemove} />
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
      selectedDancers: state.UI.selectedDancers
    }
  }
};
export default connect(makeMapStateToProps)(DancerDotsLayer);