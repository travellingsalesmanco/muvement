import React, {Component} from 'react';
import FrameScreen from "./Formation/FrameScreen";
import { Route, Switch } from "react-router-dom";
import HomeScreen from "./Home/HomeScreen";
import ChoreoHomeScreen from "./Choreo/ChoreoHomeScreen";
import LandingPageScreen from "./LandingPage/LandingPage";
import SignUpScreen from "./Auth/SignUp";
import LogInScreen from "./Auth/LogIn";
import ResetPwScreen from "./Auth/ResetPassword";
import ForgetPwScreen from "./Auth/ForgetPassword";
import Settings from "./Settings/Settings";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-125447140-3', {
  debug: false
});

class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<Switch>*/}
          <Route exact path="/" component={HomeScreen}/>
          <Route exact path="/landing" component={LandingPageScreen}/>
          <Route exact path="/signup" component={SignUpScreen}/>
          <Route exact path="/login" component={LogInScreen}/>
          <Route exact path="/resetpassword" component={ResetPwScreen}/>
          <Route exact path="/forgetpassword" component={ForgetPwScreen}/>
          <Route exact path="/settings" component={Settings}/>
          <Route exact path={`/choreo/:choreoId`} component={ChoreoHomeScreen} />
          <Route path={`/choreo/:choreoId/frame`} component={FrameScreen} />

        {/*</Switch>*/}
      </div>
    );
  }
}

export default App;
