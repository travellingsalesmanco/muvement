import React from 'react';

class GradientSVG extends React.Component {
  render() {
    let { startColor, endColor, idCSS } = this.props;

    return (
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id={idCSS} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
      </svg>
    );
  }
}

export default GradientSVG;