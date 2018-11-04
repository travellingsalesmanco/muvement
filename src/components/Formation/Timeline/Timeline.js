import React, { Component, Fragment } from 'react';
import { Circle, Group, Layer, Line, Rect, Shape, Stage, Text } from 'react-konva';
import { connect } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import { jumpToTime, offsetDuration, offsetTransitionBeforeDuration, offsetTime, overridePlayWithWavesurfer } from '../../../actions/timelineActions';
import { TIMELINE_PAUSE, TIMELINE_JUMP } from '../../../constants/actionTypes';
import { timingInterval } from '../../../constants/defaults';
import Timestamps from './Timestamps';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWidth: 0,
      displayHeight: 0,
      midPoint: 0,
      timelineDraggable: true,
      musicUrl: props.musicUrl,
      musicDuration: 0
    }
  }

  componentDidMount() {
    this.checkSize();
    this.mountMusicWaveform();
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
      if (this.wavesurfer) {
        this.wavesurfer.setHeight(this.state.displayHeight * this.props.timelineRatio * 2)
      }
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

  mountMusicWaveform() {
    this.wavesurfer = WaveSurfer.create({
      container: '#music',
      waveColor: 'violet',
      progressColor: 'purple',
      cursorWidth: 0,
      barWidth: this.props.msWidth * timingInterval / 2,
      barGap: 0,
      normalize: true,
      minPxPerSec: this.props.msWidth * 1000
    });
    this.wavesurfer.on('ready', () => {
      console.log("[Audio] Wavesurfer loaded")
      this.wavesurfer.zoom(this.props.msWidth * 1000)
      this.wavesurfer.seekAndCenter(this.props.elapsedTime / (this.wavesurfer.getDuration() * 1000));
      this.setState({ musicDuration: this.wavesurfer.getDuration() * 1000 })
      this.wavesurfer.setHeight(this.state.displayHeight * this.props.timelineRatio * 2)
    })
    if (this.state.musicUrl) {
      this.wavesurfer.load(this.props.musicUrl)
    }
  }

  centerMusicPosition(elapsedTime) {
    const musicDuration = this.state.musicDuration;
    if (elapsedTime < 0) {
      this.wavesurfer.seekAndCenter(0)
    } else if (elapsedTime >= musicDuration) {
      this.wavesurfer.seekAndCenter(1);
    } else {
      this.wavesurfer.seekAndCenter(elapsedTime / musicDuration)
    }
  }
  renderMusicWaveform() {
    if (!this.wavesurfer) {
      // Wavesurfer hasn't been created, nothing to do here
      return
    }
    if (this.state.musicUrl !== this.props.musicUrl) {
      // Music has changed, reload it if it exists
      console.log("[Audio] Music updated");
      this.wavesurfer.empty();
      this.setState({ musicUrl: this.props.musicUrl })
      if (this.props.musicUrl) {
        this.wavesurfer.load(this.props.musicUrl)
      }
    }
    if (this.state.musicDuration) {
      const musicPlaying = this.wavesurfer.isPlaying();
      const elapsedTime = this.props.elapsedTime;
      if (this.props.isPlaying && !musicPlaying && elapsedTime < this.state.musicDuration) {
        console.log("[Audio] Initiating play control override");
        this.props.dispatch(overridePlayWithWavesurfer(this.wavesurfer))
        return;
      }
      if (!musicPlaying) {
        this.centerMusicPosition(elapsedTime);
      }
    }
  }

  render() {
    const { data: timeline, msWidth, elapsedTime, handleWidth, labelRadius, timestampSeparation, timelineRatio, editable } = this.props;
    const { displayWidth, displayHeight, midPoint, timelineDraggable } = this.state;
    const timelineHeight = displayHeight * timelineRatio;
    const timelineY = displayHeight - timelineHeight;
    const elapsedWidth = elapsedTime * msWidth;
    // Max timestamp visible on screen
    const visibleTime = elapsedTime + midPoint / msWidth;
    // Position offset of max music timestamp and max visible timestamp
    // i.e. If there's insufficient remaining music to render the full width of displayed area, this value
    // will turn negative 
    const musicPosOffset = (this.state.musicDuration - visibleTime) * msWidth;
    let musicWaveformX = this.state.midPoint - elapsedWidth;
    if (musicWaveformX < 0) {
      // The waveform div is a "sliding-window" with width equals displayWidth
      // This allows music to be centered at midpoint
      musicWaveformX = musicPosOffset < 0 ? musicPosOffset : 0;
    }
    this.renderMusicWaveform();
    return (
      <div style={{ background: '#000', height: "100%", width: "100%", overflow: "hidden", position: "relative" }}
        ref={(ref) => this.container = ref}>
        <div style={{ zIndex: 0, position: "absolute", top: timelineY, left: musicWaveformX, height: timelineHeight * 2, width: this.state.displayWidth }} id="music"></div>
        <Stage preventDefault={true} width={displayWidth} height={displayHeight} ref={ref => this.stageRef = ref}>
          <Layer x={midPoint - elapsedWidth} onTap={this.handleTimelineSelect} onClick={this.handleTimelineSelect}
                 draggable={timelineDraggable}
                 dragBoundFunc={timelineDraggable ? this.timelineDragBoundFunc : null}
                 onDragMove={timelineDraggable ? this.handleDragMove : null}
          >
            <Timestamps msWidth={msWidth} interval={timestampSeparation} duration={timeline.totalDuration} />
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
                        opacity={0.7}
                      />
                      <Rect x={transitionStartPos}
                            width={transitionWidth} height={timelineHeight}
                            onTap={() => console.log(idx, " transition tapped")}
                      />

                      <Rect x={formationStartPos}
                        width={formationWidth} height={timelineHeight}
                        fillLinearGradientStartPoint={{ x: 0 }} fillLinearGradientEndPoint={{ x: formationWidth }}
                        fillLinearGradientColorStops={[0, isPast ? "#514a9d" : "#24c6dc", 1, "#514a9d"]}
                        opacity={isPast ? 0.4 : 0.7}
                        onTap={() => console.log(idx, "formation tapped")} />
                      <Group x={formationStartPos + formationWidth / 2} y={timelineHeight / 2}>
                        <Circle
                          fill={'white'}
                          radius={labelRadius}
                          opacity={isPast ? 0.2 : 0.8}
                        />
                        <Text
                          x={-labelRadius}
                          y={-labelRadius}
                          width={labelRadius * 2}
                          height={labelRadius * 2}
                          align={'center'}
                          fill={isPast ? "white" : "#5F5F5F"}
                          opacity={isPast ? 0.85 : 1}
                          fontFamily={"Sen-bold"}
                          verticalAlign={'middle'}
                          text={idx + 1}
                          fontSize={labelRadius * 1.2}
                        />
                      </Group>
                      {
                        // Don't show transition adjustment handle for first formation or if not editable
                        idx === 0 || !editable ? null :
                          <Fragment>
                            <Rect x={formationStartPos - handleWidth}
                                  width={handleWidth} height={timelineHeight}
                                  draggable
                                  onTouchStart={() => {
                                    this.setState({ timelineDraggable: false })
                                  }}
                                  onTouchEnd={() => this.setState({ timelineDraggable: true })}
                                  onDragEnd={() => this.setState({ timelineDraggable: true })}
                                  dragBoundFunc={() => {
                                    return { x: this.toDisplayX(formationStartPos - handleWidth / 2), y: timelineY }
                                  }}
                                  onDragMove={(e) => this.handleAnchorMove(e, idx, true)}
                            />
                            <Line
                              points={[formationStartPos - handleWidth / 2, handleBarStartY, formationStartPos - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line
                              points={[formationStartPos - 2 - handleWidth / 2, handleBarStartY, formationStartPos - 2 - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line
                              points={[formationStartPos + 2 - handleWidth / 2, handleBarStartY, formationStartPos + 2 - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                          </Fragment>
                      }
                      {
                        // Don't show formation duration handle if not editable
                        !editable ? null :
                          <Fragment>
                            <Rect x={formationEndPos - handleWidth}
                                  width={handleWidth} height={timelineHeight}
                                  draggable
                                  onTouchStart={() => {
                                    this.setState({ timelineDraggable: false })
                                  }}
                                  onTouchEnd={() => this.setState({ timelineDraggable: true })}
                                  onDragEnd={() => this.setState({ timelineDraggable: true })}
                                  dragBoundFunc={() => {
                                    return { x: this.toDisplayX(formationEndPos - handleWidth), y: timelineY }
                                  }}
                                  onDragMove={(e) => this.handleAnchorMove(e, idx, false)}
                            />
                            <Line
                              points={[formationEndPos - handleWidth / 2, handleBarStartY, formationEndPos - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line
                              points={[formationEndPos - 2 - handleWidth / 2, handleBarStartY, formationEndPos - 2 - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                            <Line
                              points={[formationEndPos + 2 - handleWidth / 2, handleBarStartY, formationEndPos + 2 - handleWidth / 2, handleBarEndY]}
                              stroke={"white"} strokeWidth={0.5} />
                          </Fragment>
                      }
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
