import React, {Component} from 'react';
import FrameScreen from "./FrameScreen";
import { Route, Switch } from "react-router-dom";
import HomeScreen from "./Home/HomeScreen";
import ChoreoHomeScreen from "./Choreo/ChoreoHomeScreen";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={FrameScreen}/>
          <Route path="/home" component={HomeScreen}/>
          <Route path="/choreo" component={ChoreoHomeScreen}/>
        </Switch>
      </div>
    );
  }
}

export default App;
