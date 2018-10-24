import React, { Component } from 'react';
import StageCanvas from './StageCanvas';

class ResponsiveStageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 0,
      stageHeight: 0,
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
    if (this.state.stageWidth !== this.container.offsetWidth
      || this.state.stageHeight !== this.container.offsetHeight) {

      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };
  render() {
    const { choreoId, formationId, editable, withGrid, animated, demo } = this.props;
    return (
      <div style={{ background: '#000', height: "100%", width: "100%", overflow: "hidden" }}
        ref={node => { this.container = node }}>
        <StageCanvas choreoId={choreoId} formationId={formationId} width={this.state.stageWidth}
          height={this.state.stageHeight} editable={editable} withGrid={withGrid} animated={animated} demo={demo} />
      </div>
    );
  }
}

export default ResponsiveStageCanvas;