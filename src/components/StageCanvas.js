import React, {Component} from 'react';
import {Circle, Layer, Stage, Line, Rect, Group, Text, Label, Tag, Path} from "react-konva";
import {connect} from 'react-redux'
import {makeGridLayoutSelector, makeStageLayoutSelector} from "../selectors/layout";
import {removeDancerFromFrame, moveDancer} from "../actions/frameActions"

class StageCanvas extends Component {
  constructor(props) {
    super(props);
    // To be passed in as props
    this.state = {
      isDancerSelected: this.props.dancers.map(() => false)
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

  handleDragEnd = (e, key) => {
    e.cancelBubble = true;
    let targetDancer = this.props.dancers[key].name;
    let newDancerPosition = [
      this.getRelativeX(e.target.x()),
      this.getRelativeY(e.target.y())
    ];
    console.log("OLD POSITION: " + this.props.dancers[key].position);
    console.log("NEW POSITION: " + newDancerPosition);
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
    let targetDancer = this.props.dancers[key].name;
    console.log("Remove dancer: " + targetDancer);
    this.props.dispatch(removeDancerFromFrame(this.props.danceId, this.props.frameId, targetDancer));
  };

  getAbsoluteX = (origX) => {
    let stageRect = this.props.stageLayout;
    return origX * stageRect.width + stageRect.tl.x;
  };

  getAbsoluteY = (origY) => {
    let stageRect = this.props.stageLayout;
    return origY * stageRect.height + stageRect.tl.y;
  };

  getRelativeX = (origX) => {
    let stageRect = this.props.stageLayout;
    return (origX - stageRect.tl.x) / stageRect.width;
  };

  getRelativeY = (origY) => {
    let stageRect = this.props.stageLayout;
    return (origY - stageRect.tl.y) / stageRect.height;
  };

  render() {
    const CIRCLE_RADIUS = 15;
    const ICON_SIZE = 26;
    const FONT_SIZE = 15;
    const TEXT_PADDING = 10;
    // Canvas dimensions
    let {width: canvasWidth, height: canvasHeight} = this.props;
    let stageRect = this.props.stageLayout;
    console.log("Stage: ", canvasWidth, canvasHeight);

    let gridLayer = (
      <Layer>
        {
          this.props.gridLayout
            .map((points, key) => <Line key={key} points={points} stroke={"#514a9d"} opacity={0.5}/>)
        }
      </Layer>
    );
    let stageLayer = (
      <Layer>
        <Rect width={stageRect.width} height={stageRect.height} x={stageRect.tl.x} y={stageRect.tl.y}
              stroke={"#514a9d"} strokeWidth={3}/>
      </Layer>
    );


    return (
      <Stage preventDefault={true} width={canvasWidth} height={canvasHeight}>
        {gridLayer}
        {stageLayer}
        <Layer>
          {this.props.dancers.map((dancer, key) => (
            <Group
              key={key}
              x={this.getAbsoluteX(dancer.position[0])}
              y={this.getAbsoluteY(dancer.position[1])}
              draggable
              onDragEnd={(e) => this.handleDragEnd(e, key)}
            >
              <Circle
                fill={'#24c6dc'}
                radius={CIRCLE_RADIUS}
              />
              <Text
                x={-CIRCLE_RADIUS}
                y={-CIRCLE_RADIUS}
                width={CIRCLE_RADIUS * 2}
                height={CIRCLE_RADIUS * 2}
                align={'center'}
                verticalAlign={'middle'}
                fill={'white'}
                text={key + 1}
                onDblClick={(e) => this.handleSelect(e, key)}
                onDblTap={(e) => this.handleSelect(e, key)}
              />
              <Label
                x={-(this.state.labelWidth ? (this.state.labelWidth[key] + ICON_SIZE) / 2 : 50)}
                y={-CIRCLE_RADIUS * 2 - FONT_SIZE - TEXT_PADDING * 2}
                visible={this.state.isDancerSelected[key]}
              >
                <Tag
                  fill={'#24c6dc'}
                  lineJoin={'round'}
                  cornerRadius={10}
                />
                {this.state.labelWidth ?
                  <Text
                    width={this.state.labelWidth ? this.state.labelWidth[key] + ICON_SIZE + 10 : 100}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={FONT_SIZE}
                    padding={TEXT_PADDING}
                    align={'left'}
                  />
                  :
                  // Used in initial render to calculate size of text box before addition of icon
                  <Text
                    ref={ref => (this.nameLabels[key] = ref)}
                    fill={'white'}
                    text={dancer.name}
                    fontSize={FONT_SIZE}
                    padding={TEXT_PADDING}
                    align={'left'}
                  />
                }
                <Path
                  x={this.state.labelWidth ? this.state.labelWidth[key] : 80}
                  y={(FONT_SIZE + TEXT_PADDING * 2 - ICON_SIZE) / 2}
                  data={'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z'}
                  fill={'white'}
                  scaleX={0.05}
                  scaleY={0.05}
                  onClick={(e) => this.handleRemove(e, key)}
                  onTap={(e) => this.handleRemove(e, key)}
                />
              </Label>
            </Group>
          ))}
        </Layer>
      </Stage>
    );
  }
}

// If the mapStateToProps argument supplied to connect returns a function instead of an object, it will be used
// to create an individual mapStateToProps function for each instance of the container.
// https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances

const makeMapStateToProps = () => {
  const getStageLayout = makeStageLayoutSelector();
  const getGridLayout = makeGridLayoutSelector();
  return (state, props) => {
    return {
      stageLayout: getStageLayout(state, props),
      gridLayout: getGridLayout(state, props),
      dancers: state.dances[props.danceId].frames[props.frameId].dancers
    }
  }
};

export default connect(makeMapStateToProps)(StageCanvas);