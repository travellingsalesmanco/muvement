import React, { Component, Fragment } from 'react';
import { Circle, Group, Layer, Line, Rect, Shape, Stage, Text } from 'react-konva';
import { connect } from 'react-redux';
import { offsetDuration, offsetTransitionBeforeDuration } from '../../actions/timelineActions';
import { TIMELINE_JUMP, TIMELINE_PAUSE } from '../../constants/actionTypes';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWidth: 0,
      displayHeight: 0,
      midPoint: 0,
      timelineDraggable: true
    }
  }
  componentDidMount() {
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    if (this.state.displayWidth !== this.container.offsetWidth
      || this.state.displayHeight !== this.container.offsetHeight) {

      this.setState({
        displayWidth: this.container.offsetWidth,
        displayHeight: this.container.offsetHeight,
        midPoint: this.container.offsetWidth / 2
      });
    }
  };

  toDisplayX = x => x + this.state.midPoint - this.props.elapsedTime * this.props.msWidth

  timelineDragBoundFunc = (pos) => {
    const timelineWidth = this.props.data.totalDuration * this.props.msWidth;
    let newX = pos.x
    if (pos.x > this.state.midPoint) {
      newX = this.state.midPoint
    } else if (pos.x < this.state.midPoint - timelineWidth) {
      newX = this.state.midPoint - timelineWidth
    }
    return {
      x: newX,
      y: 0
    }
  }

  handleDragMove = (e) => {
    if (this.props.isPlaying) {
      this.props.dispatch({ type: TIMELINE_PAUSE })
    }
    const relativeDragPos = this.state.midPoint - e.target.x();
    console.log(relativeDragPos);
    const newTime = Math.trunc(relativeDragPos / this.props.msWidth);
    if (newTime !== this.props.elapsedTime) {
      this.props.dispatch({
        type: TIMELINE_JUMP,
        payload: newTime
      })
    }
  }

  inFocus = (elapsedWidth, leftBound, rightBound) =>
    elapsedWidth >= leftBound && elapsedWidth <= rightBound

  isPast = (elapsedWidth, rightBound) => elapsedWidth >= rightBound

  handleTimelineSelect = (e) => {
    const { x: pointerX } = e.target.getStage().getPointerPosition();
    let updatedTime = this.props.elapsedTime + (pointerX - this.state.midPoint) / this.props.msWidth;

    // Some validation guards
    if (updatedTime > this.props.data.totalDuration) {
      updatedTime = this.props.data.totalDuration;
    } else if (updatedTime < 0) {
      updatedTime = 0;
    }

    if (this.props.isPlaying) {
      this.props.dispatch({ type: TIMELINE_PAUSE })
    }
    this.props.dispatch({
      type: TIMELINE_JUMP,
      payload: updatedTime
    })
  }

  handleAnchorMove = (e, anchorTimelineX, formationIdx, isTransition) => {
    const { x: pointerX } = e.target.getStage().getPointerPosition();
    const offsetPos = pointerX - this.toDisplayX(anchorTimelineX);
    const offsetDur = offsetPos / this.props.msWidth;
    console.log(offsetDur);
    if (isTransition) {
      this.props.dispatch(offsetTransitionBeforeDuration(this.props.choreoId, formationIdx, offsetDur))
    } else {
      this.props.dispatch(offsetDuration(this.props.choreoId, formationIdx, offsetDur))
    }
  }

  render() {
    const { data: timeline, msWidth, elapsedTime } = this.props;
    if (elapsedTime > timeline.totalDuration) {
      this.props.dispatch({ type: TIMELINE_JUMP, payload: timeline.totalDuration })
    }
    const { displayWidth, displayHeight, midPoint, timelineDraggable } = this.state;
    const timelineHeight = displayHeight * 0.85;
    const timelineWidth = timeline.totalDuration * msWidth;
    const timelineY = displayHeight - timelineHeight;
    const elapsedWidth = elapsedTime * msWidth;
    const radius = 15;
    let timestampDivisions = [];
    const timestampSeparation = 1000;
    for (let i = 0; i <= timeline.totalDuration; i += timestampSeparation) {
      timestampDivisions.push(i)
    }
    return (
      <div style={{ background: '#000', height: "100%", width: "100%", overflow: "hidden" }}
        ref={(ref) => this.container = ref}>
        <Stage preventDefault={true} width={displayWidth} height={displayHeight} ref={ref => this.stageRef = ref}>
          <Layer x={midPoint - elapsedWidth} onTap={this.handleTimelineSelect} onClick={this.handleTimelineSelect}
            draggable={timelineDraggable}
            dragBoundFunc={timelineDraggable ? this.timelineDragBoundFunc : null}
            onDragMove={timelineDraggable ? this.handleDragMove : null}
          >
            {
              timestampDivisions.map((timestamp) => {
                const timestampPos = timestamp * msWidth;
                if (timestamp % 2000 === 0) {
                  const minutes = Math.floor(timestamp / 60000);
                  let [seconds] = ((timestamp % 60000) / 1000).toString().split(".");
                  if (seconds.length === 1) {
                    seconds = "0" + seconds
                  }
                  return <Text
                    key={timestamp}
                    x={timestampPos}
                    y={0}
                    fill={'white'}
                    fontFamily={"Sen-bold"}
                    text={minutes + ":" + seconds}
                    fontSize={12}
                  />
                  // } else if (timestamp % 1000 === 0) {
                  //   return <Line points={[timestampPos, timelineY, timestampPos, timelineY - 5]}
                  //     key={timestamp}
                  //     stroke={"white"} strokeWidth={1} opacity={0.8} />
                } else {
                  return null
                }
              })
            }
            {/* <Line points={[0, timelineY - 1, timelineWidth, timelineY - 1]} stroke={"white"} strokeWidth={1} opacity={0.5} /> */}
            <Group y={timelineY}>
              {
                timeline.cumDurations.map(([formationStart, formationEnd], idx, cumDurations) => {
                  const transitionStartPos = idx === 0 ? 0 : cumDurations[idx - 1][1] * msWidth;
                  const formationStartPos = formationStart * msWidth;
                  const formationEndPos = formationEnd * msWidth;
                  const transitionWidth = formationStartPos - transitionStartPos;
                  const formationWidth = formationEndPos - formationStartPos;
                  const isPast = this.isPast(elapsedWidth, formationEndPos);
                  const handleWidth = 10;
                  return (
                    <Fragment key={idx}>
                      <Shape x={transitionStartPos}
                        sceneFunc={(context, shape) => {
                          context.beginPath()
                          context.moveTo(0, 0)
                          context.lineTo(0, timelineHeight)
                          context.lineTo(transitionWidth, 0)
                          context.lineTo(transitionWidth, timelineHeight)
                          context.closePath()
                          context.fillStrokeShape(shape)
                        }}
                        fillLinearGradientStartPoint={{ x: 0 }} fillLinearGradientEndPoint={{ x: transitionWidth }}
                        fillLinearGradientColorStops={[0, "#24c6dc", 1, "#514a9d"]}
                      />
                      <Rect x={transitionStartPos}
                        width={transitionWidth} height={timelineHeight}
                        onTap={() => console.log(idx, " transition tapped")}
                      />

                      <Rect x={formationStartPos}
                        width={formationWidth} height={timelineHeight}
                        fillLinearGradientStartPoint={{ x: 0 }} fillLinearGradientEndPoint={{ x: formationWidth }}
                        fillLinearGradientColorStops={[0, isPast ? "#514a9d" : "#24c6dc", 1, "#514a9d"]}
                        opacity={isPast ? 0.6 : 0.9}
                        onTap={() => console.log(idx, "formation tapped")} />
                      <Group x={formationStartPos + formationWidth / 2} y={timelineHeight / 2}>
                        <Circle
                          fill={'#24c6dc'}
                          radius={radius}
                        />
                        <Text
                          x={-radius}
                          y={-radius}
                          width={radius * 2}
                          height={radius * 2}
                          align={'center'}
                          verticalAlign={'middle'}
                          fill={'white'}
                          text={idx + 1}
                          fontSize={12}
                        />
                      </Group>
                      {
                        // Don't show transition adjustment handle for first formation
                        idx === 0 ? null :
                          <Fragment>
                            <Rect x={formationStartPos - handleWidth}
                              width={handleWidth} height={timelineHeight}
                              draggable
                              onTouchStart={() => { this.setState({ timelineDraggable: false }) }}
                              onTouchEnd={() => this.setState({ timelineDraggable: true })}
                              onDragEnd={() => this.setState({ timelineDraggable: true })}
                              dragBoundFunc={() => { return { x: this.toDisplayX(formationStartPos - handleWidth / 2), y: timelineY } }}
                              onDragMove={(e) => this.handleAnchorMove(e, formationStartPos, idx, true)}
                            />
                            <Line points={[formationStartPos - handleWidth / 2, timelineHeight / 4, formationStartPos - handleWidth / 2, timelineHeight * 3 / 4]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line points={[formationStartPos - 1 - handleWidth / 2, timelineHeight / 4, formationStartPos - 1 - handleWidth / 2, timelineHeight * 3 / 4]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line points={[formationStartPos + 1 - handleWidth / 2, timelineHeight / 4, formationStartPos + 1 - handleWidth / 2, timelineHeight * 3 / 4]}
                              stroke={"white"} strokeWidth={0.5} />
                          </Fragment>
                      }
                      <Rect x={formationEndPos - handleWidth}
                        width={handleWidth} height={timelineHeight}
                        draggable
                        onTouchStart={() => { this.setState({ timelineDraggable: false }) }}
                        onTouchEnd={() => this.setState({ timelineDraggable: true })}
                        onDragEnd={() => this.setState({ timelineDraggable: true })}
                        dragBoundFunc={() => { return { x: this.toDisplayX(formationEndPos - handleWidth), y: timelineY } }}
                        onDragMove={(e) => this.handleAnchorMove(e, formationEndPos, idx, false)}
                      />
                      <Line points={[formationEndPos - handleWidth / 2, timelineHeight / 4, formationEndPos - handleWidth / 2, timelineHeight * 3 / 4]}
                        stroke={"white"} strokeWidth={0.5} />
                      <Line points={[formationEndPos - 1 - handleWidth / 2, timelineHeight / 4, formationEndPos - 1 - handleWidth / 2, timelineHeight * 3 / 4]}
                        stroke={"white"} strokeWidth={0.5} />
                      <Line points={[formationEndPos + 1 - handleWidth / 2, timelineHeight / 4, formationEndPos + 1 - handleWidth / 2, timelineHeight * 3 / 4]}
                        stroke={"white"} strokeWidth={0.5} />
                    </Fragment>
                  );
                })
              }
            </Group>
          </Layer>
          <Layer>
            <Line points={[midPoint, 0, midPoint, displayHeight]} stroke={"white"} strokeWidth={4} />
          </Layer>
        </Stage>
      </div>
    )
  }
}
export default connect()(Timeline);
