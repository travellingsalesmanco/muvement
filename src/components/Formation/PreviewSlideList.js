import React from 'react';
import {connect} from 'react-redux';
import {gotoFormation, reorderAndFocusFormation} from "../../actions/choreoActions";
import StageCanvas from "../StageCanvas/StageCanvas";
import './PreviewSlideList.css';
import Draggable from 'react-draggable';
import { getChoreo } from '../../selectors/choreo';

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
        slideListHeight: this.slide.offsetHeight * this.props.formations.length
      });
    }
  };

  updateSlidePos = () => {
    const {origSlidePos, slidePos, slideHeight} = this.state;
    let formationsPos = [];
    let currY = 0;
    let initState = false;
    let stateChanged = false;
    this.props.formations.forEach((formation, index) => {
      // Note: only increases Y-value
      formationsPos.push({ x: 0, y: currY});
      if (origSlidePos.length === 0 || origSlidePos.length !== this.props.formations.length) {
        initState = true;
      } else if (slidePos[index].y !== origSlidePos[index].y) {
        stateChanged = true;
      }
      currY += slideHeight;
    });
    if (initState) { // initial render
      this.setState({
        slidePos: formationsPos,
        origSlidePos: formationsPos,
        slideListHeight: this.slide.offsetHeight * this.props.formations.length
      })
    }
    if (stateChanged && !this.state.slidePosChanged) { // due to resizing events
      this.setState({
        slidePos: formationsPos,
      })
    }

    if (stateChanged && this.state.slidePosChanged && this.state.slideDragEnded) { // after slide is dragged to new pos
      this.setState({
        slidePos: formationsPos,
        origSlidePos: formationsPos,
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
          // Same formation, change focus
          this.props.dispatch(gotoFormation(this.props.choreoId, index));
        } else {
          // Reorder and change focus
          this.props.dispatch(reorderAndFocusFormation(this.props.choreoId, index, toIndex));
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
            this.props.formations.map((formation, index) => (
              <Draggable
                key={index}
                axis="y"
                bounds="parent"
                grid={[this.state.slideWidth, this.state.slideHeight]}
                position={{x: 0, y: 0}}
                onDrag={(e, ui) => this.handleDrag(index, e, ui)}
                onStop={() => this.handleDragStop(index)}
              >
                <div className={index === this.props.activeFormationId ? "slide-outer linear-gradient-bg" : "slide-outer"}
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
                      <StageCanvas choreoId={this.props.choreoId} formationId={index} width={this.state.stageWidth}
                                   height={this.state.stageHeight} />
                    </div>
                  </div>
                  <span className="slide-title">{index + 1}. {formation.name}</span>
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
  const choreo = getChoreo(state, props.choreoId)
  return {
    activeFormationId: state.UI.activeFormation,
    formations: choreo.formations
  }
}

export default connect(mapStateToProps)(PreviewSlideList);
