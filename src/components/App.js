import React, {Component} from 'react';
import FrameScreen from "./FrameScreen";
import { Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={FrameScreen}/>
        </Switch>
      </div>
    );
  }
}

export default App;
