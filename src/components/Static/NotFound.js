import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {
  render() {
    return (
      <div style={{margin: "auto"}}>
        <h2>Nothing to see here</h2>
        <Link to={`/`}>Bring Me Home</Link>
      </div>
    );
  }
}

export default NotFound;