import React, { Component } from "react";
import Axios from "axios";
import ReactDOM from "react-dom";
import Products from "./Products";

import "./../css/Navigation.css";
/**
 * Registration class used for User Registration
 * @author Rahul Das Adhikary, rahul.das.adhikary@gmail.com, +91-9880978662
 *
 */
class Registration extends Component {
  /**
   * Saving customer information
   */
  handleSubmit = event => {
    event.preventDefault();

    let reg_name = document.getElementById("reg-name").value;
    let reg_email = document.getElementById("reg-email").value;
    let reg_password = document.getElementById("reg-password").value;

    //Saving customer information
    Axios.post(`https://backendapi.turing.com/customers`, {
      name: reg_name,
      email: reg_email,
      password: reg_password
    })
      .then(res => {
        //console.log(res.data);
        sessionStorage.setItem("jwtToken", res.data.accessToken);
        sessionStorage.setItem("loggedInUser", res.data.customer.name);

        document.getElementById("signinplaceholder").innerText = "Sign Out";
        document.getElementById("usernamemenu").innerText =
          res.data.customer.name;

        var div = document.createElement("div");
        ReactDOM.render(<Products />, div);
        document.getElementById("productPanel").childNodes[0].remove();
        document.getElementById("productPanel").appendChild(div);
      })
      .catch(e => {
        let errMesg = e.response.data.error.message;
        console.error("Failed to register the user:", errMesg);
        alert(`Failed to register the user. ${errMesg}`);

        return;
      });
  };

  /**
   * Default component renderer
   */
  render() {
    return (
      <div align="center">
        <h3 className="textcol_orange">User Registration </h3>
        <small>
          <b>
            <table>
              <tbody>
                <tr>
                  <td className="form_textlabel">
                    Full Name:
                    <i className="required" />
                  </td>
                  <td alight="left">
                    <input
                      type="text"
                      id="reg-name"
                      name="reg-name"
                      placeholder="Full name"
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">
                    New Password:
                    <i className="required" />
                  </td>
                  <td>
                    <input
                      type="password"
                      id="reg-password"
                      name="reg-password"
                      placeholder="New Password"
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">
                    Confirm Password:
                    <i className="required" />
                  </td>
                  <td>
                    <input
                      type="password"
                      id="reg-confirm_password"
                      name="reg-confirm_password"
                      placeholder="Confirm Password"
                      className="form_text"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="form_textlabel">
                    Email Address:
                    <i className="required" />
                  </td>
                  <td alight="left">
                    <input
                      type="text"
                      id="reg-email"
                      name="reg-email"
                      placeholder="Email address"
                      className="form_text"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </b>
        </small>
        <div align="center">
          <p>
            <button className="button_login" onClick={this.handleSubmit}>
              <b>Sign Up</b>
            </button>
          </p>
        </div>
      </div>
    );
  }
}

export default Registration;
