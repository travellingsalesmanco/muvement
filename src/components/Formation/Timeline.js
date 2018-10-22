import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTimeline } from '../../selectors/layout';
import { advanceNextFrame } from '../../actions/timelineActions';
import { Stage } from 'react-konva'

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timelineWidth: 0,
      timelineHeight: 0
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
    if (this.state.timelineWidth !== this.container.offsetWidth
      || this.state.timelineHeight !== this.container.offsetHeight) {

      this.setState({
        timelineWidth: this.container.offsetWidth,
        timelineHeight: this.container.offsetHeight
      });
    }
  };
  render() {
    const { playing, danceId, frameId, timeline } = this.props;
    if (playing) {
      this.props.dispatch(advanceNextFrame(danceId, frameId, timeline.cumDuration[frameId], timeline.totalDuration))
    }
    return (
      <div style={{ background: '#000', flex: 1, overflow: "hidden" }}
        ref={(ref) => this.container = ref}>
        <Stage preventDefault={true} width={this.state.timelineWidth} height={this.state.timelineHeight}>
        </Stage>
      </div>
    )
  }
}
const mapStateToProps = (state, props) => {
  return {
    timeline: getTimeline(state, props)
  }
}
export default connect(mapStateToProps)(Timeline);