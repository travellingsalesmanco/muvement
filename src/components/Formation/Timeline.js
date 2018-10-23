import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTimeline } from '../../selectors/layout';
import { advanceNextFrame } from '../../actions/timelineActions';
import { Stage, Rect, Layer, Line } from 'react-konva'
import { LOAD_ANIMATED_VIEW, UNLOAD_ANIMATED_VIEW } from '../../constants/actionTypes';

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timelineWidth: 0,
      timelineHeight: 0
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: LOAD_ANIMATED_VIEW })
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentWillUnmount() {
    this.props.dispatch({ type: UNLOAD_ANIMATED_VIEW })
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
    const { playing, choreoId, formationId, timeline } = this.props;
    if (playing) {
      this.props.dispatch(advanceNextFrame(choreoId, formationId, timeline.cumDuration[formationId], timeline.totalDuration))
    }
    return (
      <div style={{ background: '#000', height: "100%", width: "100%", overflow: "hidden" }}
        ref={(ref) => this.container = ref}>
        <Stage preventDefault={true} width={this.state.timelineWidth} height={this.state.timelineHeight}>
          <Layer>
            <Rect width={this.state.timelineWidth} height={100} fillLinearGradientStartPoint={{ x: 0 }} fillLinearGradientEndPoint={{ x: 100 }} fillLinearGradientColorStops={[0, "#24c6dc", 1, "#514a9d"]} draggable dragBoundFunc={(pos) => {let newX = pos.x; let newY = pos.y; if(pos.y !== 0){newY = 0} if(pos.x < -(this.state.timelineWidth/2)){newX = -(this.state.timelineWidth/2)} if(pos.x > (this.state.timelineWidth/2)){newX = (this.state.timelineWidth/2)} return {x: newX, y: newY} }} />
            <Line points={[this.state.timelineWidth / 2, 0, this.state.timelineWidth / 2, 100]} stroke={"white"} strokeWidth={5} />
          </Layer>
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
