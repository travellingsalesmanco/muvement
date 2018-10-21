import { Card } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { gotoFrame } from "../../actions/danceActions";
import StageCanvas from "../StageCanvas/StageCanvas";
import './MobileFormationCards.css';

class MobileFormationCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: 100,
      stageHeight: 100,
    }
  }
  clickHandler = (index) => {
    this.props.dispatch(gotoFrame(this.props.danceId, index - 1));
    this.props.history.push(`${this.props.match.url}/frame`)
  };
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
    if (this.state.stageWidth !== this.container.offsetWidth || this.state.stageHeight !== this.container.offsetHeight) {
      this.setState({
        stageWidth: this.container.offsetWidth,
        stageHeight: this.container.offsetHeight
      });
    }
  };
  render() {
    return (
      <div>
      {
        this.props.frames.map((formation, index) => (
          <Card
            key={index}
            hoverable
            bordered={false}
            className="mobile-formation-card"
            onClick={() => this.clickHandler(index)}
          >
            <div className="mobile-formation-card-cover">
              <div style={{width: '40%', padding: '0 2em'}}>
                <div className="mobile-formation-name">
                  <span>{index + 1}. {formation.name}</span>
                </div>
              </div>
              <div className="mobile-formation-preview-container"
                   ref={node=>{
                     if (index === 0) {
                       this.container = node;
                     }}}>
                <div className="mobile-formation-preview">
                  <StageCanvas danceId={this.props.danceId} frameId={index} width={this.state.stageWidth}
                               height={this.state.stageHeight} />
                </div>
              </div>
            </div>
          </Card>
        ))
      }
      </div>
    );
  }
}
export default withRouter(connect()(MobileFormationCards));
