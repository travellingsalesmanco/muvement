import React from 'react';
import {connect} from 'react-redux';
import {gotoFrame} from "../../actions/danceActions";
import StageCanvas from "../StageCanvas/StageCanvas";
import './PreviewSlideList.css';

class PreviewSlideList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 100,
      stageHeight: 100,
    }
  }

  componentDidMount() {
    this.checkSize();
    window.addEventListener("slide-resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener("slide-resize", this.checkSize);
  }

  checkSize = () => {
    console.log(this.state.stageWidth, this.state.stageHeight, this.container.offsetWidth, this.container.offsetHeight)
    if (this.state.stageWidth !== this.container.offsetWidth
      || this.state.stageHeight !== this.container.offsetHeight) {

      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };

  handleClick = (index) => {
    this.props.dispatch(gotoFrame(this.props.danceId, index));
  };

  render() {
    return (
      <div className="slide-list">
        <h3 className="slide-list-title">All Formations</h3>
          {
            this.props.frames.map((frame, index) => (
              <div className={ index === this.props.activeFrameId ? "slide-outer linear-gradient-bg" : "slide-outer"}
                   key={index} onClick={() => this.handleClick(index)}>
                <div className="stage-wrapper">
                  <div className="stage-container"
                       ref={node => {
                         if (index === 0) {
                           this.container = node;
                         }
                       }}>
                    <StageCanvas danceId={this.props.danceId} frameId={index} width={this.state.stageWidth}
                                 height={this.state.stageHeight} />
                  </div>
                </div>
                <span className="slide-title">{index + 1}. {frame.name}</span>
              </div>
            ))
          }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const activeDance = state.dances[state.UI.activeDance];
  return {
    danceId: state.UI.activeDance,
    activeFrameId: state.UI.activeFrame,
    frames: activeDance.frames
  }
}

export default connect(mapStateToProps)(PreviewSlideList);
