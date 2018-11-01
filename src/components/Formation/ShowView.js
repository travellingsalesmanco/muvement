import { Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { play } from '../../actions/timelineActions';
import { TIMELINE_PAUSE, TIMELINE_PLAY } from '../../constants/actionTypes';
import { getTimeline } from '../../selectors/layout';
import Timeline from './Timeline/Timeline';
import './FormationScreen.css';

class ShowView extends Component {
  componentWillUnmount() {
    this.props.dispatch({ type: TIMELINE_PAUSE })
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

  render() {
    return (
      <div className="show-view" style={{ flex: 1, textAlign: "center"}}>
        <div style={{ height: "6rem", paddingTop: "0.5rem" }}>
          <Timeline choreoId={this.props.choreoId} data={this.props.timeline} msWidth={0.05} elapsedTime={this.props.elapsedTime} isPlaying={this.props.isPlaying} />
        </div>
        <div className = "show-timing" style={{ fontFamily: "Sen-bold", fontSize: "1.5rem", color: "#fff" }}>
          {this.msToDisplayedTime(this.props.elapsedTime)}
        </div>
        <div className = "show-buttons">
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
    isPlaying: state.UI.isPlaying
  }
}
export default connect(mapStateToProps)(ShowView);
