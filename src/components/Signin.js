import React, { Component } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import Registration from "./Registration";

import "./../css/Navigation.css";

/**
 * User for Signin,
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 */
class Signin extends Component {
  state = {
    redirect: false
  };

  /**
   * This will take the control to user registration page when New User is clicked
   */
  userregistraton = () => e => {
    var div = document.createElement("div");
    ReactDOM.render(<Registration />, div);
    document.getElementById("userprofile").childNodes[0].remove();
    document.getElementById("userprofile").appendChild(div);
  };

  /**
   * After Signing the home page will be shown
   */
  renderRedirect = () => {
    if (this.state.redirect) {
      this.setState({
        redirect: false
      });
      return <Redirect to="/home" />;
    }
  };

  /**
   * This he authentication function that happens with backend
   */
  usersignin = event => {
    event.preventDefault();

    let signin_email = document.getElementById("signin-email").value;
    let signin_password = document.getElementById("signin-password").value;

    Axios.post(`https://backendapi.turing.com/customers/login`, {
      email: signin_email,
      password: signin_password
    })
      .then(res => {
        this.setState({
          redirect: true
        });
        //console.log(res.data);

        sessionStorage.setItem("jwtToken", res.data.accessToken);
        sessionStorage.setItem("loggedInUser", res.data.user.name);
        document.getElementById("signinplaceholder").innerText = "Sign Out";
        document.getElementById("usernamemenu").innerText = res.data.user.name;
      })
      .catch(e => {
        console.error(`Failed to authenticate the user:`, e);
        alert(`Failed to authenticate the user:${signin_email}`);
        return;
      });
  };

  /**
   * Default component renderer
   */
  render() {
    return (
      <div align="center">
        <h3 className="textcol_orange">Signin </h3>
        <table className="table">
          <tbody>
            <tr>
              <td className="required">
                <small>
                  <b>Email address:</b>
                </small>
              </td>
              <td alight="left">
                <input
                  type="text"
                  id="signin-email"
                  name="signin-email"
                  placeholder="Email address"
                />
              </td>
            </tr>
            <tr>
              <td className="required">
                <small>
                  <b>Password:</b>
                </small>
              </td>
              <td>
                <input
                  type="password"
                  id="signin-password"
                  name="signin-password"
                  placeholder="Password"
                />
              </td>
            </tr>
            <tr>
              <td />
              <td align="left">
                <input
                  type="checkbox"
                  id="signin-remember"
                  name="signin-remember"
                />{" "}
                <b>
                  <small>Remember</small>
                </b>
              </td>
            </tr>
            <tr>
              <td>
                <button className="button_link">
                  <b>
                    <small>Forgot password?</small>
                  </b>
                </button>
              </td>
              <td align="right">
                <button
                  className="button_link"
                  onClick={this.userregistraton()}
                >
                  <b>
                    <small>New User!!</small>
                  </b>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div />
        <p />
        <p align="center">
          {this.renderRedirect()}
          <button className="button_login" onClick={this.usersignin}>
            <b>Sign In</b>
          </button>
        </p>
      </div>
    );
  }
}

export default Signin;
