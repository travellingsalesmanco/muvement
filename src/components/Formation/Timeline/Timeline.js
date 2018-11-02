import React, { Component, Fragment } from 'react';
import { Circle, Group, Layer, Line, Rect, Shape, Stage, Text } from 'react-konva';
import { connect } from 'react-redux';
import { offsetDuration, offsetTransitionBeforeDuration, jumpToTime } from '../../../actions/timelineActions';
import { TIMELINE_JUMP, TIMELINE_PAUSE } from '../../../constants/actionTypes';
import Timestamps from './Timestamps';

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
    this.props.dispatch(jumpToTime(relativeDragPos / this.props.msWidth))
  }

  inFocus = (elapsedWidth, leftBound, rightBound) =>
    elapsedWidth >= leftBound && elapsedWidth <= rightBound

  isPast = (elapsedWidth, rightBound) => elapsedWidth >= rightBound

  handleTimelineSelect = (e) => {
    const pointerPos = e.target.getStage().getPointerPosition();
    let transform = e.currentTarget.getAbsoluteTransform().copy();
    transform.invert();
    let updatedTime = transform.point(pointerPos).x / this.props.msWidth;

    // Some validation guards
    if (updatedTime > this.props.data.totalDuration) {
      updatedTime = this.props.data.totalDuration;
    } else if (updatedTime < 0) {
      updatedTime = 0;
    }

    if (this.props.isPlaying) {
      this.props.dispatch({ type: TIMELINE_PAUSE })
    }
    this.props.dispatch(jumpToTime(updatedTime))
  }

  handleAnchorMove = (e, formationIdx, isTransition) => {
    console.log(e);
    const pointerPos = e.target.getStage().getPointerPosition();
    let transform = e.currentTarget.getAbsoluteTransform().copy();
    transform.invert();
    const offsetPos = transform.point(pointerPos);
    const offsetDur = offsetPos.x / this.props.msWidth;
    if (isTransition) {
      this.props.dispatch(offsetTransitionBeforeDuration(this.props.choreoId, formationIdx, offsetDur))
    } else {
      this.props.dispatch(offsetDuration(this.props.choreoId, formationIdx, offsetDur))
    }
  }

  render() {
    console.log("timeline render");
    const { data: timeline, msWidth, elapsedTime, handleWidth, labelRadius, timestampSeparation } = this.props;
    if (elapsedTime > timeline.totalDuration) {
      this.props.dispatch({ type: TIMELINE_JUMP, payload: timeline.totalDuration })
    }
    const { displayWidth, displayHeight, midPoint, timelineDraggable } = this.state;
    const timelineHeight = displayHeight * 0.85;
    const timelineY = displayHeight - timelineHeight;
    const elapsedWidth = elapsedTime * msWidth;
    return (
      <div style={{ background: '#000', height: "100%", width: "100%", overflow: "hidden" }}
        ref={(ref) => this.container = ref}>
        <Stage preventDefault={true} width={displayWidth} height={displayHeight} ref={ref => this.stageRef = ref}>
          <Layer x={midPoint - elapsedWidth} onTap={this.handleTimelineSelect} onClick={this.handleTimelineSelect}
            draggable={timelineDraggable}
            dragBoundFunc={timelineDraggable ? this.timelineDragBoundFunc : null}
            onDragMove={timelineDraggable ? this.handleDragMove : null}
          >
            <Timestamps msWidth={msWidth} interval={timestampSeparation} duration={timeline.totalDuration} />
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
                  const handleBarHeight = timelineHeight * 0.4
                  const handleBarStartY = (timelineHeight - handleBarHeight) / 2;
                  const handleBarEndY = handleBarStartY + handleBarHeight;
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
                          radius={labelRadius}
                        />
                        <Text
                          x={-labelRadius}
                          y={-labelRadius}
                          width={labelRadius * 2}
                          height={labelRadius * 2}
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
                              onDragMove={(e) => this.handleAnchorMove(e, idx, true)}
                            />
                            <Line points={[formationStartPos - handleWidth / 2, handleBarStartY, formationStartPos - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line points={[formationStartPos - 2 - handleWidth / 2, handleBarStartY, formationStartPos - 2 - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line points={[formationStartPos + 2 - handleWidth / 2, handleBarStartY, formationStartPos + 2 - handleWidth / 2, handleBarEndY]}
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
                        onDragMove={(e) => this.handleAnchorMove(e, idx, false)}
                      />
                      <Line points={[formationEndPos - handleWidth / 2, handleBarStartY, formationEndPos - handleWidth / 2, handleBarEndY]}
                        stroke={"white"} strokeWidth={0.5} />
                      <Line points={[formationEndPos - 2 - handleWidth / 2, handleBarStartY, formationEndPos - 2 - handleWidth / 2, handleBarEndY ]}
                        stroke={"white"} strokeWidth={0.5} />
                      <Line points={[formationEndPos + 2 - handleWidth / 2, handleBarStartY, formationEndPos + 2 - handleWidth / 2, handleBarEndY ]}
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
