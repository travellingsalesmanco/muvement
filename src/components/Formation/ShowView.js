import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play, jumpToTime } from '../../actions/timelineActions';
import { TIMELINE_PAUSE, TIMELINE_PLAY, TIMELINE_JUMP } from '../../constants/actionTypes';
import { getTimeline } from '../../selectors/layout';
import Timeline from './Timeline/Timeline';
import './FormationScreen.css';
import { gotoFormation } from '../../actions/choreoActions';

class ShowView extends Component {
  componentDidMount() {
    this.props.dispatch(jumpToTime(
      this.props.timeline.cumDurations[this.props.activeFormation][0]
    ))
  }
  componentWillUnmount() {
    this.props.dispatch({ type: TIMELINE_PAUSE })
  }
  componentDidUpdate() {
    const formation = this.findCurrentFormation();
    if (formation !== this.props.activeFormation) {
      this.props.dispatch(gotoFormation(this.props.choreoId, formation));
    }
  }
  msToDisplayedTime = (t) => {
    const minutes = Math.floor(t / 60000);
    const [displayedSeconds, displayedMs] = ((t % 60000) / 1000).toFixed(2).toString().split(".");
    if (displayedSeconds === "60") {
      return (minutes + 1) + ":00:" + displayedMs
    } else {
      return minutes + ":"
        + (displayedSeconds.length === 1 ? "0" : "")
        + displayedSeconds + ":" + displayedMs
    }
  }
  togglePlay = () => {
    const action = this.props.isPlaying ? TIMELINE_PAUSE : TIMELINE_PLAY
    this.props.dispatch({ type: action })
    if (action === TIMELINE_PLAY) {
      this.props.dispatch(play(this.props.timeline.totalDuration, 30, 1))
    }
  }
  fastForward = () => {

  }
  slowDown = () => {

  }
  // Binary search for formation in focus
  findCurrentFormation() {
    const cumDurations = this.props.timeline.cumDurations;
    let l = 0, r = cumDurations.length;
    let mid = 0;
    while (l < r) {
      mid = Math.floor((r + l) / 2);
      if (this.props.elapsedTime > cumDurations[mid][1]) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    return l;
  }


  render() {
    const { elapsedTime, timeline, isPlaying, choreoId } = this.props;
    if (elapsedTime > timeline.totalDuration) {
      this.props.dispatch({ type: TIMELINE_JUMP, payload: timeline.totalDuration })
    }
    return (
      <div className="show-view" style={{ flex: 1, textAlign: "center" }}>
        <div style={{ height: "6rem", paddingTop: "0.5rem" }}>
          <Timeline choreoId={choreoId} data={timeline} msWidth={0.05} elapsedTime={elapsedTime} isPlaying={isPlaying}
            labelRadius={14} handleWidth={10} timestampSeparation={2000} />
        </div>
        <div className="show-timing" style={{ fontFamily: "Sen-bold", fontSize: "1.5rem", color: "#fff" }}>
          {this.msToDisplayedTime(elapsedTime)}
        </div>
        <div className="show-buttons">
          <Button type={"default"} ghost icon={"double-left"} style={{ border: 0, fontSize: "1.5rem" }}
            onClick={this.slowDown} />
          <Button type={"default"} ghost icon={this.props.isPlaying ? "pause" : "caret-right"} style={{ border: 0, fontSize: "1.5rem" }}
            onClick={this.togglePlay} />
          <Button type={"default"} ghost icon={"double-right"} style={{ border: 0, fontSize: "1.5rem" }}
            onClick={this.fastForward} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const timeline = getTimeline(state, props)
  return {
    timeline: timeline,
    elapsedTime: state.UI.elapsedTime,
    isPlaying: state.UI.isPlaying,
    activeFormation: state.UI.activeFormation
  }
}
export default connect(mapStateToProps)(ShowView);
