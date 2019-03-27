import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import "./../css/Navigation.css";

/**
 * This class provides the Log out functionality
 */
class LogOut extends Component {
  state = {
    redirect: false
  };

  /**
   * THis function will be called when Signout button is clicked and perform the Signout features
   */
  usersignout = event => {
    event.preventDefault();

    sessionStorage.setItem("jwtToken", "");
    global.cartItemsArr = [];
    sessionStorage.clear();
    document.getElementById("signinplaceholder").innerText = "Signin";
    document.getElementById("usernamemenu").innerText = "User";

    this.setState({
      redirect: true
    });
  };

  /**
   * After Signout the controll will be taken to home page
   */
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/home" />;
    }
  };

  /**
   * default component renderer
   */
  render() {
    return (
      <div id="userlogout">
        <h3 className="textcol_maroon">
          <small>Are you sure you want to log out?</small>
        </h3>
        <p align="center">
          {this.renderRedirect()}
          <button className="button_login" onClick={this.usersignout}>
            <b>Sign Out</b>
          </button>
        </p>
      </div>
    );
  }
}

export default LogOut;
