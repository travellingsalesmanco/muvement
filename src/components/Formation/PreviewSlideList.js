import React from 'react';
import {connect} from 'react-redux';
import {gotoFrame, reorderAndFocusFrame} from "../../actions/danceActions";
import StageCanvas from "../StageCanvas/StageCanvas";
import './PreviewSlideList.css';
import Draggable from 'react-draggable';
import { getDance } from '../../selectors/dance';

class PreviewSlideList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 100,
      stageHeight: 100,
      slideWidth: 115,
      slideHeight: 115,
      slideListHeight: 115,
      slidePos: [],
      slidePosChanged: false,
      slideDragEnded: false,
      origSlidePos: []
    }
  }

  componentDidMount() {
    this.checkSize();
    this.updateSlidePos();
    window.addEventListener("slide-resize", this.checkSize);
  }

  componentDidUpdate() {
    this.checkSize();
    this.updateSlidePos();
  }

  componentWillUnmount() {
    window.removeEventListener("slide-resize", this.checkSize);
  }

  checkSize = () => {
    if (this.state.stageWidth !== this.container.offsetWidth
      || this.state.stageHeight !== this.container.offsetHeight) {

      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight,
        // Slide operations
        slideWidth: this.slide.offsetWidth,
        slideHeight: this.slide.offsetHeight,
        slideListHeight: this.slide.offsetHeight * this.props.frames.length
      });
    }
  };

  updateSlidePos = () => {
    const {origSlidePos, slidePos, slideHeight} = this.state;
    let framesPos = [];
    let currY = 0;
    let initState = false;
    let stateChanged = false;
    this.props.frames.forEach((frame, index) => {
      // Note: only increases Y-value
      framesPos.push({ x: 0, y: currY});
      if (origSlidePos.length === 0 || origSlidePos.length !== this.props.frames.length) {
        initState = true;
      } else if (slidePos[index].y !== origSlidePos[index].y) {
        stateChanged = true;
      }
      currY += slideHeight;
    });
    if (initState) { // initial render
      this.setState({
        slidePos: framesPos,
        origSlidePos: framesPos,
        slideListHeight: this.slide.offsetHeight * this.props.frames.length
      })
    }
    if (stateChanged && !this.state.slidePosChanged) { // due to resizing events
      this.setState({
        slidePos: framesPos,
      })
    }

    if (stateChanged && this.state.slidePosChanged && this.state.slideDragEnded) { // after slide is dragged to new pos
      this.setState({
        slidePos: framesPos,
        origSlidePos: framesPos,
        slideDragEnded: false,
        slidePosChanged: false
      })
    }
  };

  handleDrag = (index, e, ui) => {
    const {x, y} = this.state.slidePos[index];
    const newSlidePos = this.state.slidePos.slice();
    newSlidePos[index] = { x: x + ui.deltaX, y: y + ui.deltaY };
    this.setState({
      slidePos: newSlidePos,
      slidePosChanged: true
    })
  };

  handleDragStop = (index) => {
    const {x, y} = this.state.slidePos[index];
    const origY = this.state.origSlidePos[index].y;
    const directionY = (origY - y) < 0 ? -1 : 1; // downwards is negative, upwards is positive
    const displacementY = Math.abs(origY - y);
    const displacementInSlides = Math.floor(displacementY / this.state.slideHeight);
    const toIndex = (directionY < 0)
      ? index + displacementInSlides
      : (directionY > 0)
        ? index - displacementInSlides : index;
    if (directionY !== 0) {
      this.setState({
        slideDragEnded: true
      }, () => {
        console.log("switch", index, toIndex);

        if (index === toIndex) {
          // Same frame, change focus
          this.props.dispatch(gotoFrame(this.props.danceId, index));
        } else {
          // Reorder and change focus
          this.props.dispatch(reorderAndFocusFrame(this.props.danceId, index, toIndex));
        }
      })
    } else {
      // no change in slides
    }
  };

  render() {
    return (
      <div className="slide-list-container">
        <h3 className="slide-list-title">All Formations</h3>
        <div className="slide-list">
          <div style={{height: this.state.slideListHeight}}>
          {
            this.props.frames.map((frame, index) => (
              <Draggable
                key={index}
                axis="y"
                bounds="parent"
                grid={[this.state.slideWidth, this.state.slideHeight]}
                position={{x: 0, y: 0}}
                onDrag={(e, ui) => this.handleDrag(index, e, ui)}
                onStop={() => this.handleDragStop(index)}
              >
                <div className={index === this.props.activeFrameId ? "slide-outer linear-gradient-bg" : "slide-outer"}
                     ref={node=>{
                       if (index === 0) {
                         this.slide = node;
                       }}}
                >
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
              </Draggable>
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const dance = getDance(state, props.danceId)
  return {
    activeFrameId: state.UI.activeFrame,
    frames: dance.frames
  }
}

export default connect(mapStateToProps)(PreviewSlideList);
