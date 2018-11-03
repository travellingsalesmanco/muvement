import { Button, Icon, Upload, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gotoFormation, updateChoreoMusic } from '../../actions/choreoActions';
import { jumpToTime, play } from '../../actions/timelineActions';
import { TIMELINE_JUMP, TIMELINE_PAUSE, TIMELINE_PLAY } from '../../constants/actionTypes';
import { getTimeline } from '../../selectors/layout';
import './FormationScreen.css';
import Timeline from './Timeline/Timeline';
import { storage } from '../../firebase';
import { getChoreo } from '../../selectors/choreo';

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
  handleMusicUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      console.log("uploading music");
    } else if (info.file.status === 'done') {
      console.log("upload complete", info.file.response);
      this.props.dispatch(updateChoreoMusic(this.props.choreoId, info.file.response));
    }
  };

  render() {
    const { elapsedTime, timeline, isPlaying, choreoId, musicUrl, editable } = this.props;
    if (elapsedTime > timeline.totalDuration) {
      this.props.dispatch({ type: TIMELINE_JUMP, payload: timeline.totalDuration })
    }
    return (
      <div className="show-view" style={{ flex: 1, textAlign: "center" }}>
        <div style={{ height: "6rem", paddingTop: "0.5rem" }}>
          <Timeline choreoId={choreoId} data={timeline} msWidth={0.05} elapsedTime={elapsedTime} isPlaying={isPlaying}
            labelRadius={14} handleWidth={10} timestampSeparation={2000} editable={editable} musicUrl={musicUrl} />
        </div>
        <div className="show-timing" style={{ fontFamily: "Sen-bold", fontSize: "1.5rem", color: "#fff" }}>
          {this.msToDisplayedTime(elapsedTime)}
        </div>
        <div className="show-buttons">
          <Button type={"default"} ghost style={{ border: 0 }} onClick={this.slowDown}>
            <Icon style={{ fontSize: "1.5rem", color: "white" }} type={"double-left"} theme="outlined" />
          </Button>
          <Button type={"default"} ghost style={{ marginLeft: "0.5rem", marginRight: "0.5rem", border: "0" }} onClick={this.togglePlay}>
            <Icon style={{ fontSize: "2.5rem", color: "#24C6DC" }} type={isPlaying ? "pause" : "caret-right"} theme="outlined" />
          </Button>
          <Button type={"default"} ghost style={{ border: 0 }} onClick={this.fastForward}>
            <Icon style={{ fontSize: "1.5rem", color: "white" }} type={"double-right"} theme="outlined" />
          </Button>
        </div>
        <div style={{ margin: '1em 0' }}>
          <Upload 
            name={"music"}
            accept={"audio/*"}
            showUploadList={false}
            customRequest={(req) => storage.addChoreoMusic(req.file, choreoId).then((link) => {
              req.onSuccess(link);
            })}
            beforeUpload={(file) => {
              if(file.size / 1024 / 1024 > 5) {
                message.error('Audio file must be smaller than 5MB!')
                return false
              }
              return true;
            }}
            onChange={this.handleMusicUploadChange}
          >
            <Button type={"default"} ghost style={{ borderRadius: "1em" }}>
              Add Music
            </Button>
          </Upload>
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
    activeFormation: state.UI.activeFormation,
    musicUrl: getChoreo(state, props.choreoId).musicUrl
  }
}
export default connect(mapStateToProps)(ShowView);
