import React, { Component } from "react";
import Signin from "./Signin";

import "./../css/Navigation.css";
import UserProfile from "./UserProfile";

/**
 * Ligin class used to render UserProfile.
 * If Customer has not logged in, SignIn page will be displayed.
 * If the User is loggedin, then the User Profile will be displayed to update the Customer deails.
 */
class CustomerProfile extends Component {
  render() {
    let jwtToken = sessionStorage.getItem("jwtToken");
    let userProfile;
    if (!jwtToken || jwtToken === "") {
      userProfile = <Signin />;
    } else {
      userProfile = <UserProfile />;
    }

    return <div id="userprofile">{userProfile}</div>;
  }
}

export default CustomerProfile;
