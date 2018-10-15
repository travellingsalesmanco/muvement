import React, { PureComponent } from 'react';
import { Group, Layer } from 'react-konva';
import { connect } from 'react-redux';
import { moveDancer, removeDancerFromFrame } from '../../actions/frameActions';
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
    this.nameLabels = [];

  }

  componentDidMount() {
    this.setState({
      labelWidth: this.nameLabels.map(textLabel => {
        return textLabel.getWidth()
      })
    });
  }

  bindWithinCanvas(pos) {
    let newX = pos.x;
    let newY = pos.y
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

  handleDragEnd = (e, key) => {
    e.cancelBubble = true;
    const targetDancer = this.props.dancersLayout[key].name;
    const newDancerPosition = [
      absoluteToRelativeX(e.target.x(), this.props.stageRect),
      absoluteToRelativeY(e.target.y(), this.props.stageRect)
    ];
    this.props.dispatch(moveDancer(this.props.danceId, this.props.frameId, targetDancer, newDancerPosition));
  };

  handleSelect = (e, key) => {
    e.cancelBubble = true;
    let newDancerSelection = this.state.isDancerSelected.slice();
    newDancerSelection[key] = !newDancerSelection[key];
    this.setState({
      isDancerSelected: newDancerSelection
    });
  };

  // TODO: Handle width issues to remaining nodes when deleting, might be shifted out to parent component
  handleRemove = (e, key) => {
    e.cancelBubble = true;
    let targetDancer = this.props.dancersLayout[key].name;
    console.log("Remove dancer: " + targetDancer);
    this.props.dispatch(removeDancerFromFrame(this.props.danceId, this.props.frameId, targetDancer));
  };

  render() {
    const { editable } = this.props;
    const CIRCLE_RADIUS = 15;
    const ICON_SIZE = 26;
    const FONT_SIZE = 15;
    const TEXT_PADDING = 10;
    return (
      <Layer>
        {this.props.dancersLayout.map((dancerLayout, key) => {
          return (
            <Group
              key={key}
              x={dancerLayout.position.x}
              y={dancerLayout.position.y}
              draggable={editable}
              dragBoundFunc={(pos) => this.bindWithinCanvas(pos)}
              onDragEnd={(e) => this.handleDragEnd(e, key)}
            >
              <DancerDot radius={CIRCLE_RADIUS} number={dancerLayout.id} onSelect={(e) => this.handleSelect(e, key)} />
              <DancerLabel />
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
      dancersLayout: getDancersLayout(state, props)
    }
  }
};
export default connect(makeMapStateToProps)(DancerDotsLayer);