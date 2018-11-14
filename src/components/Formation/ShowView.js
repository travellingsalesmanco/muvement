import { Button, Icon, message, Upload } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { gotoFormation, updateChoreoMusic } from '../../actions/choreoActions';
import { jumpToTime, play, slowDown, speedUp } from '../../actions/timelineActions';
import { TIMELINE_JUMP, TIMELINE_PAUSE, TIMELINE_PLAY, LOAD_ANIMATED_VIEW, UNLOAD_ANIMATED_VIEW } from '../../constants/actionTypes';
import { storage } from '../../firebase';
import { getChoreo } from '../../selectors/choreo';
import { getTimeline } from '../../selectors/layout';
import './FormationScreen.css';
import Timeline from './Timeline/Timeline';
import { removeChoreoMusic } from '../../firebase/storage';
import { MobilePortrait, MinTablet } from '../ResponsiveUtils/BreakPoint';

class ShowView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formation: 0
    }
  }
  componentDidMount() {
    this.props.dispatch(jumpToTime(
      this.props.timeline.cumDurations[this.props.activeFormation][0]
    ))
  }

  componentWillUnmount() {
    this.props.dispatch({ type: TIMELINE_PAUSE })
  }

  componentDidUpdate() {
    if (this.props.elapsedTime > this.props.timeline.totalDuration) {
      this.props.dispatch({ type: TIMELINE_JUMP, payload: this.props.timeline.totalDuration })
    }
    const [formationStart, formationEnd] = this.props.timeline.cumDurations[this.props.activeFormation]
    if (this.props.elapsedTime >= formationStart && this.props.elapsedTime <= formationEnd) {
      this.props.dispatch({type: UNLOAD_ANIMATED_VIEW})
    } else {
      this.props.dispatch({type: LOAD_ANIMATED_VIEW})
    }

    if (this.state.formation !== this.props.activeFormation) {
      // Detect activeFormation change
      this.setState({ formation: this.props.activeFormation })
      // ActiveFormation mismatch with timeline => sync timeline
      if (this.props.elapsedTime < formationStart || this.props.elapsedTime > formationEnd) {
        this.props.dispatch(jumpToTime(formationStart))
      }
      return;
    } else {
      const formation = this.findCurrentFormation();
      // Timeline mismatched with activeFormation => sync active formation
      if (formation !== null && formation !== this.props.activeFormation) {
        this.props.dispatch(gotoFormation(this.props.choreoId, formation));
      }
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
      this.props.dispatch(play(this.props.timeline.totalDuration))
    }
  }

  // Binary search for formation in focus
  findCurrentFormation() {
    const cumDurations = this.props.timeline.cumDurations;
    const elapsedTime = this.props.elapsedTime;
    let l = 0, r = cumDurations.length - 1;
    let mid = 0;
    while (l < r) {
      mid = Math.floor((r + l) / 2);
      if (elapsedTime > cumDurations[mid][1]) {
        l = mid + 1;
      } else {
        r = mid;
      }
    }
    const [formationStart, formationEnd] = cumDurations[l];
    return elapsedTime >= formationStart && elapsedTime <= formationEnd ? l : null;
  }

  handleMusicUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      console.log("[Audio] Uploading...");
    } else if (info.file.status === 'done') {
      console.log("[Audio] Upload complete");
      this.props.dispatch(updateChoreoMusic(this.props.choreoId, info.file.response));
    }
  };

  handleRemoveMusic = () => {
    // TODO: Confirmation dialog
    this.props.dispatch(updateChoreoMusic(this.props.choreoId, null))
    removeChoreoMusic(this.props.choreoId);
  }

  render() {
    const { elapsedTime, timeline, isPlaying, choreoId, musicUrl, playbackRate, editable, music } = this.props;
    const playControls = (
      <div className="show-buttons">
        <Button type={"default"} ghost style={{ border: 0 }} onClick={() => this.props.dispatch(slowDown())}>
          <Icon style={{ fontSize: "1.5rem", color: "white" }} type={"double-left"} theme="outlined" />
        </Button>
        <Button type={"default"} ghost style={{ marginLeft: "0.5rem", marginRight: "0.5rem", border: "0" }}
          onClick={this.togglePlay}>
          <Icon style={{ fontSize: "2.5rem", color: "#24C6DC" }} type={isPlaying ? "pause" : "caret-right"}
            theme="outlined" />
        </Button>
        <Button type={"default"} ghost style={{ border: 0 }} onClick={() => this.props.dispatch(speedUp())}>
          <Icon style={{ fontSize: "1.5rem", color: "white" }} type={"double-right"} theme="outlined" />
        </Button>
      </div>
    );
    const MusicButton = () => {
      if (musicUrl) {
        return <Button type={"danger"} ghost style={{ borderRadius: "1em" }}
                       onClick={this.handleRemoveMusic}> Remove Music </Button>
      } else {
        return <Upload name={"music"} accept={"audio/*"} showUploadList={false}
                       customRequest={(req) => storage.addChoreoMusic(req.file, choreoId).then((link) => {
                         req.onSuccess(link);
                       })}
                       beforeUpload={(file) => {
                         if (file.size / 1024 / 1024 > 5) {
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
      }
    };
    return (
      <Fragment>
        <MobilePortrait>
          <div className="show-view" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: "6rem", paddingTop: "0.5rem" }}>
              <Timeline choreoId={choreoId} data={timeline} msWidth={0.05} elapsedTime={elapsedTime} isPlaying={isPlaying}
                playbackRate={playbackRate}
                labelRadius={14} handleWidth={10} timestampSeparation={2000} timelineRatio={0.85}
                editable={editable} musicUrl={musicUrl} />
            </div>
            <div className="show-timing" style={{ fontFamily: "Sen-bold", fontSize: "1.5rem", color: "#fff" }}>
              {this.msToDisplayedTime(elapsedTime)}
            </div>
            {playControls}

            {editable &&
              <div style={{ padding: "1rem" }}>
                {
                  music
                  ? <MusicButton musicUrl={musicUrl}/>
                  : null
                }

              </div>
            }
          </div>
        </MobilePortrait>
        <MinTablet>
          <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexBasis: "50%", flexGrow: 1}}>
              <div style={{flex: 1}}>
              </div>
              <div className="show-timing" style={{ fontFamily: "Sen-bold", fontSize: "1.5rem", color: "#fff", flex:1, textAlign: "center" }}>
                {playControls}
                {this.msToDisplayedTime(elapsedTime)}
              </div>
              {editable
                ? <div style={{ flex: 1, textAlign: "right" }}>
                  {
                    music
                      ? <MusicButton musicUrl={musicUrl}/>
                      : null
                  }
                </div>
                : <div style={{flex: 1}}>
                </div>
              }
            </div>

            <div style={{ paddingTop: "0.5rem", flexBasis:"50%", flexGrow: 1 }}>
              <Timeline choreoId={choreoId} data={timeline} msWidth={0.05} elapsedTime={elapsedTime} isPlaying={isPlaying}
                playbackRate={playbackRate}
                labelRadius={14} handleWidth={10} timestampSeparation={2000} timelineRatio={0.85}
                editable={editable} musicUrl={musicUrl} />
            </div>
          </div>

        </MinTablet>
      </Fragment>

    )
  }
}

const mapStateToProps = (state, props) => {
  const timeline = getTimeline(state, props);
  console.log(timeline, state.UI.elapsedTime);
  return {
    timeline: timeline,
    elapsedTime: state.UI.elapsedTime,
    isPlaying: state.UI.isPlaying,
    activeFormation: state.UI.activeFormation,
    musicUrl: getChoreo(state, props.choreoId).musicUrl,
    playbackRate: state.UI.playbackRate
  }
};

export default connect(mapStateToProps)(ShowView);
