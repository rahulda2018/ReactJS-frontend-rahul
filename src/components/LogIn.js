import React, { Component } from "react";
import Signin from "./Signin";
import LogOut from "./LogOut";

import "./../css/Navigation.css";

/**
 * Ligin class used to render Signin, Registration and Logout
 */
class LogIn extends Component {
  render() {
    let jwtToken = sessionStorage.getItem("jwtToken");
    let userProfile;
    if (!jwtToken || jwtToken === "") {
      userProfile = <Signin />;
    } else {
      userProfile = <LogOut />;
    }

    return <div id="userprofile">{userProfile}</div>;
  }
}

export default LogIn;
